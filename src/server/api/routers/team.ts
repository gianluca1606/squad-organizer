import { User } from "@clerk/nextjs/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
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
          managers: {
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

  delete: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log(input.teamId);
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
      where: { managers: { some: { clerkId: ctx.auth.userId } } },
    });
  }),

  getTeamData: protectedProcedure
    .input(z.object({ teamId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.teamId) {
        return await ctx.prisma.team.findFirst({
          where: { managers: { some: { clerkId: ctx.auth.userId } } },
        });
      } else {
        return await ctx.prisma.team.findFirst({
          where: { id: input.teamId },
        });
      }
    }),

  getMembers: protectedProcedure
    .input(z.object({ teamId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      //check if user is member of team or manager of team
      const isUserManager = await ctx.prisma.teamManagers.findFirst({
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
        };
      });

      return publicMembers;
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    // TODO should only be able to get all users if you're an admin
    return ctx.prisma.team.findMany({
      where: { managers: { some: { clerkId: ctx.auth.userId } } },
    });
  }),
});
