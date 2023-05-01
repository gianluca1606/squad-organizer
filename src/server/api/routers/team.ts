import { User } from "@clerk/nextjs/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { TeamDataWithAlreadyInTeam } from "~/interfaces/CreateEditTeamProps";
import { PublicUser } from "~/interfaces/PublicUser";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
          manager: {
            create: {
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

  delete: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.prisma.team.delete({
        where: {
          id: input.teamId,
        },
      });
      return deleted;
    }),

  removeUserFromTeam: protectedProcedure
    .input(z.object({ clerkId: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
          { manager: { some: { clerkId: ctx.auth.userId } } },
          { teamMember: { some: { clerkId: ctx.auth.userId } } },
        ],
      },
    });
  }),

  getTeamData: protectedProcedure
    .input(z.object({ teamId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      let teamData;
      if (!input.teamId) {
        teamData = await ctx.prisma.team.findFirst({
          where: { manager: { some: { clerkId: ctx.auth.userId } } },
        });
      } else {
        teamData = await ctx.prisma.team.findFirst({
          where: { id: input.teamId },
        });
      }

      const isUserAlreadyInTeam = await ctx.prisma.teamMember.findFirst({
        where: { teamId: teamData?.id, clerkId: ctx.auth.userId },
      });

      const userRequestedToJoinTeam = await ctx.prisma.joinRequest.findFirst({
        where: {
          teamId: teamData?.id,
          clerkId: ctx.auth.userId,
        },
      });

      return {
        ...teamData,
        isUserAlreadyInTeam: !!isUserAlreadyInTeam,
        userRequestedToJoinTeam: !!userRequestedToJoinTeam,
      } as TeamDataWithAlreadyInTeam;
    }),

  getMembers: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      //check if user is member of team or manager of team
      const isUserManager = await ctx.prisma.teamManager.findFirst({
        where: { teamId: input.teamId, clerkId: ctx.auth.userId },
      });

      const isUserMember = await ctx.prisma.teamMember.findFirst({
        where: { teamId: input.teamId, clerkId: ctx.auth.userId },
      });

      if (!isUserManager && !isUserMember) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a member of this team",
        });
      }

      const clerksIds = await ctx.prisma.teamMember.findMany({
        where: { teamId: input.teamId },
        select: { clerkId: true },
      });

      const members: User[] = await clerkClient.users.getUserList({
        userId: clerksIds.map((clerk) => clerk.clerkId),
      });
      const publicMembers: PublicUser[] = members.map((member) => {
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
          isManager: !!isUserManager,
        };
      });

      return publicMembers;
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    // TODO should only be able to get all teams if you're an admin
    return ctx.prisma.team.findMany({
      where: { manager: { some: { clerkId: ctx.auth.userId } } },
    });
  }),

  getAllContributionsAndPunishmentsForTeam: protectedProcedure
    .input(z.object({ teamId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      //check if user is member of team or manager of team
      const isUserManager = await ctx.prisma.teamManager.findFirst({
        where: { teamId: input.teamId, clerkId: ctx.auth.userId },
      });

      const punishments =
        await ctx.prisma.punishmentOrContributionType.findMany({
          where: { teamId: input.teamId },
        });

      return {
        punishments,
        isUserManager: isUserManager ? true : false,
      };
    }),
});
