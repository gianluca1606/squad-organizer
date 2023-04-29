import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const punishmentAndContributionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.punishmentOrContributionList.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          teamId: input.teamId,
        },
      });
      return data;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        punishmentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.punishmentOrContributionList.delete({
        where: {
          id: input.punishmentId,
        },
      });
    }),

  getAllForTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const list = await ctx.prisma.punishmentOrContributionList.findMany({
        where: {
          teamId: input.teamId,
        },
      });
      const isUserManager = await ctx.prisma.teamManagers.findFirst({
        where: { teamId: input.teamId, clerkId: ctx.auth.userId },
      });

      return {
        list,
        isUserManager: !!isUserManager,
      };
    }),
});
