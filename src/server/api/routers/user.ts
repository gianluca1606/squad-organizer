import { clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { AuthUtil } from '~/utils/auth-utils';
import { OWNER } from '~/utils/constants';

const removeRoles = async (prismaClient: PrismaClient, teamId: string, clerkId: string) => {
    return await prismaClient.role.deleteMany({
        where: {
            teamId,
            clerkId,
        },
    });
};

export const userRouter = createTRPCRouter({
    turnUserIntoOwner: protectedProcedure
        .input(
            z.object({
                teamId: z.string(),
                clerkId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const isUserOwner = await AuthUtil.isUserOwner(ctx.prisma, input.teamId, ctx.auth.userId);

            if (!isUserOwner) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You are not an owner',
                });
            }

            const isUserAlreadyOwner = await AuthUtil.isUserOwner(ctx.prisma, input.teamId, input.clerkId);

            if (isUserAlreadyOwner) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'User is already an owner',
                });
            }

            const isUserAlreadyTeamMember = await AuthUtil.isUserTeamMember(ctx.prisma, input.teamId, input.clerkId);

            if (!isUserAlreadyTeamMember) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'User is not a team member',
                });
            }

            // remove all roles
            await removeRoles(ctx.prisma, input.teamId, input.clerkId);
            return await ctx.prisma.role.create({
                data: {
                    teamId: input.teamId,
                    name: OWNER,
                    clerkId: input.clerkId,
                },
            });
        }),
    turnUserIntoManager: protectedProcedure
        .input(
            z.object({
                teamId: z.string(),
                clerkId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // check if user is manager first
            const isUserManagerOrOwner = await AuthUtil.isUserManagerOrOwner(ctx.prisma, input.teamId, ctx.auth.userId);

            if (!isUserManagerOrOwner) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You are not a manager or owner',
                });
            }

            // check if user is already manager
            const isUserAlreadyManager = await AuthUtil.isUserManager(ctx.prisma, input.teamId, input.clerkId);

            if (isUserAlreadyManager) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'User is already a manager',
                });
            }

            // check if user is already team member
            const isUserAlreadyTeamMember = await AuthUtil.isUserTeamMember(ctx.prisma, input.teamId, input.clerkId);

            if (!isUserAlreadyTeamMember) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'User is not a team member',
                });
            }

            // remove all roles
            await removeRoles(ctx.prisma, input.teamId, input.clerkId);
            // turn user into manager
            await ctx.prisma.role.create({
                data: {
                    teamId: input.teamId,
                    name: 'MANAGER',
                    clerkId: input.clerkId,
                },
            });

            return;
        }),

    removeFromTeam: protectedProcedure
        .input(
            z.object({
                teamId: z.string(),
                clerkId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // check if user is already team member
            const isUserAlreadyTeamMember = await AuthUtil.isUserTeamMember(ctx.prisma, input.teamId, input.clerkId);

            if (!isUserAlreadyTeamMember) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'User is not a team member',
                });
            }

            const isUserManagerOrOwner = await AuthUtil.isUserManagerOrOwner(ctx.prisma, input.teamId, ctx.auth.userId);

            if (!isUserManagerOrOwner) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You are not a manager or owner',
                });
            }

            // remove roles from this user and team
            await removeRoles(ctx.prisma, input.teamId, input.clerkId);

            return await ctx.prisma.teamMember.delete({
                where: {
                    clerkId_teamId: {
                        clerkId: input.clerkId,
                        teamId: input.teamId,
                    },
                },
            });
        }),
});
