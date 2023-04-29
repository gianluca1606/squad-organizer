import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
});
