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

export const joinRequestRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isUserAlreadyInTeam = await ctx.prisma.teamMember.findFirst({
        where: {
          clerkId: ctx.auth.userId,
          teamId: input.teamId,
        },
      });

      if (isUserAlreadyInTeam) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already in this team",
        });
      }

      const data = await ctx.prisma.joinRequests.create({
        data: {
          teamId: input.teamId,
          clerkId: ctx.auth.userId,
        },
      });
      return data;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        joinRequestId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.joinRequests.delete({
        where: {
          id: input.joinRequestId,
        },
      });
    }),

  getAllForLoggedInUser: protectedProcedure.query(async ({ ctx, input }) => {
    const list = await ctx.prisma.joinRequests.findMany({
      where: {
        clerkId: ctx.auth.userId,
      },
    });

    return list;
  }),

  getAllForTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const isTeamManager = await ctx.prisma.teamManagers.findFirst({
        where: {
          clerkId: ctx.auth.userId,
          teamId: input.teamId,
        },
      });

      if (!isTeamManager) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a manager of this team",
        });
      }

      const list = await ctx.prisma.joinRequests.findMany({
        where: {
          teamId: input.teamId,
        },
      });

      if (list.length > 0) {
        const members: User[] = await clerkClient.users.getUserList({
          userId: list.map((clerk) => clerk.clerkId),
        });
        // create an array of users with the ids of list

        const requests = members.map((member) => {
          return {
            id: member.id,
            birthday: member.birthday,
            username: member.username,
            firstName: member.firstName,
            lastName: member.lastName,
            emailAddresses: member.emailAddresses,
            profileImageUrl: member.profileImageUrl,
            joinRequestId: list.find((clerk) => clerk.clerkId === member.id)
              ?.id,
          };
        });

        return requests;
      } else return null;
    }),

  accept: protectedProcedure
    .input(z.object({ joinRequestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const joinRequest = await ctx.prisma.joinRequests.findFirst({
        where: {
          id: input.joinRequestId,
        },
      });

      if (!joinRequest) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Join request not found",
        });
      }

      const isTeamManager = await ctx.prisma.teamManagers.findFirst({
        where: {
          clerkId: ctx.auth.userId,
          teamId: joinRequest.teamId,
        },
      });

      if (!isTeamManager) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a manager of this team",
        });
      }

      const isUserAlreadyInTeam = await ctx.prisma.teamMember.findFirst({
        where: {
          clerkId: joinRequest.clerkId,
          teamId: joinRequest.teamId,
        },
      });

      if (isUserAlreadyInTeam) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already in this team",
        });
      }

      await ctx.prisma.teamMember.create({
        data: {
          clerkId: joinRequest.clerkId,
          teamId: joinRequest.teamId,
        },
      });

      await ctx.prisma.joinRequests.delete({
        where: {
          id: input.joinRequestId,
        },
      });

      return true;
    }),
});
