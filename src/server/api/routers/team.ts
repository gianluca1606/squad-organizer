import { type User } from '@clerk/nextjs/api';
import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { type PublicUser } from '@/interfaces/PublicUser';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { AuthUtil } from '@/utils/auth-utils';
import { OWNER, PUNISHMENT_OR_CONTRIBUTION } from '@/utils/constants';

export const teamRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                description: z.string().optional(),
                location: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const teamData = await ctx.prisma.team.create({
                data: {
                    name: input.name,
                    description: input.description,
                    location: input.location,
                    role: {
                        create: {
                            name: OWNER,
                            clerkId: ctx.auth.userId,
                        },
                    },
                    teamMember: {
                        create: {
                            clerkId: ctx.auth.userId,
                        },
                    },
                },
            });

            return teamData;
        }),

    update: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                description: z.string().optional(),
                location: z.string().optional(),
                teamId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { name, description, location, teamId } = input;
            const updated = await ctx.prisma.team.update({
                data: {
                    name,
                    description,
                    location,
                },
                where: {
                    id: teamId,
                },
            });
            return updated;
        }),

    delete: protectedProcedure.input(z.object({ teamId: z.string() })).mutation(async ({ ctx, input }) => {
        const isUserOwner = await AuthUtil.isUserOwner(ctx.prisma, input.teamId, ctx.auth.userId);

        if (!isUserOwner) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'You are not the owner of this team',
            });
        }
        const deleted = await ctx.prisma.team.delete({
            where: {
                id: input.teamId,
            },
        });
        return deleted;
    }),

    removeUserFromTeam: protectedProcedure
        .input(z.object({ clerkId: z.string(), teamId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const isUserManager = await ctx.prisma.team.findFirst({
                where: {
                    id: input.teamId,
                    role: {
                        some: {
                            name: 'OWNER',
                            clerkId: ctx.auth.userId,
                        },
                    },
                },
            });

            if (!isUserManager) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not the manager of this team',
                });
            }
            const user = await ctx.prisma.teamMember.delete({
                where: {
                    id: input.clerkId,
                },
            });
            return user;
        }),

    getTeamsForLoggedInUser: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.team.findMany({
            where: {
                OR: [
                    { role: { some: { clerkId: ctx.auth.userId } } },
                    { teamMember: { some: { clerkId: ctx.auth.userId } } },
                ],
            },
        });
    }),

    getTeamData: protectedProcedure.input(z.object({ teamId: z.string().optional() })).query(async ({ ctx, input }) => {
        let teamData;
        if (!input.teamId) {
            return null;
        } else {
            teamData = await ctx.prisma.team.findFirst({
                where: { id: input.teamId },
            });
        }

        const isUserManager = await AuthUtil.isUserManager(ctx.prisma, teamData?.id, ctx.auth.userId);

        const isUserOwner = await AuthUtil.isUserOwner(ctx.prisma, teamData?.id, ctx.auth.userId);

        const isUserAlreadyInTeam = await AuthUtil.isUserTeamMember(ctx.prisma, teamData?.id, ctx.auth.userId);

        const userRequestedToJoinTeam = await ctx.prisma.joinRequest.findFirst({
            where: {
                teamId: teamData?.id,
                clerkId: ctx.auth.userId,
            },
        });

        return {
            ...teamData,
            isUserAlreadyInTeam: isUserAlreadyInTeam,
            userRequestedToJoinTeam: !!userRequestedToJoinTeam,
            isUserManager: isUserManager,
            isUserOwner: isUserOwner,
        };
    }),

    getMembers: protectedProcedure.input(z.object({ teamId: z.string() })).query(async ({ ctx, input }) => {
        //check if user is member of team or manager of team
        const isUserMember = await AuthUtil.isUserTeamMember(ctx.prisma, input.teamId, ctx.auth.userId);

        if (!isUserMember) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'You are not a member of this team',
            });
        }

        const clerksIds = await ctx.prisma.teamMember.findMany({
            where: { teamId: input.teamId },
            select: { clerkId: true },
        });

        const members: User[] = await clerkClient.users.getUserList({
            userId: clerksIds.map((clerk) => clerk.clerkId),
        });
        const publicMembers: PublicUser[] = await Promise.all(
            members.map(async (member) => {
                const isUserManager = await AuthUtil.isUserManager(ctx.prisma, input.teamId, member.id);

                const isUserOwner = await AuthUtil.isUserOwner(ctx.prisma, input.teamId, member.id);

                const totalMoneySpentArr = await ctx.prisma.teamBalance.findMany({
                    where: {
                        teamId: input.teamId,
                        clerkId: member.id,
                        entryType: PUNISHMENT_OR_CONTRIBUTION,
                        payed: true,
                        price: {
                            gt: 0,
                        },
                    },
                    select: {
                        price: true,
                    },
                });

                const totalMoneySpent = totalMoneySpentArr.reduce((acc, curr) => {
                    if (curr.price) {
                        return acc + curr.price;
                    }
                    return acc;
                }, 0);
                return {
                    id: member.id,
                    createdAt: member.createdAt,
                    updatedAt: member.updatedAt,
                    gender: member.gender,
                    birthday: member.birthday,
                    username: member.username,
                    firstName: member.firstName,
                    lastName: member.lastName,
                    emailAddresses: member.emailAddresses,
                    profileImageUrl: member.profileImageUrl,
                    primaryEmailAddressId: member.primaryEmailAddressId,
                    isManager: isUserManager,
                    isOwner: isUserOwner,
                    totalMoneySpent,
                };
            })
        );

        return publicMembers;
    }),
    getAll: protectedProcedure.query(({ ctx }) => {
        // TODO should only be able to get all teams if you're an admin
        return ctx.prisma.team.findMany({
            where: { role: { some: { clerkId: ctx.auth.userId } } },
        });
    }),

    getAllContributionsAndPunishmentsForTeam: protectedProcedure
        .input(z.object({ teamId: z.string().optional() }))
        .query(async ({ ctx, input }) => {
            //check if user is member of team or manager of team
            const isUserManager = await AuthUtil.isUserManager(ctx.prisma, input.teamId, ctx.auth.userId);

            const isUserOwner = await AuthUtil.isUserOwner(ctx.prisma, input.teamId, ctx.auth.userId);

            const punishmentsOrContributions = await ctx.prisma.punishmentOrContributionType.findMany({
                where: { teamId: input.teamId },
            });
            const canEditPunishmentsOrContributions = !!(isUserOwner || isUserManager);
            return {
                punishmentsOrContributions,
                canEditPunishmentsOrContributions: canEditPunishmentsOrContributions,
            };
        }),
});
