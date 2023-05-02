import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const punishmentOrContributionTypeRouter = createTRPCRouter({
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
      const data = await ctx.prisma.punishmentOrContributionType.create({
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
        punishmentOrContributionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.punishmentOrContributionType.delete({
        where: {
          id: input.punishmentOrContributionId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number().optional(),
        punishmentOrContributionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.punishmentOrContributionType.update({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
        },
        where: {
          id: input.punishmentOrContributionId,
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
      const list = await ctx.prisma.punishmentOrContributionType.findMany({
        where: {
          teamId: input.teamId,
        },
      });
      const isUserManager = await ctx.prisma.teamManager.findFirst({
        where: { teamId: input.teamId, clerkId: ctx.auth.userId },
      });

      return {
        list,
        isUserManager: !!isUserManager,
      };
    }),
});
