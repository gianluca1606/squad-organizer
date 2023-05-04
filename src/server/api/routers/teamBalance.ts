import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { AuthUtil } from "~/utils/auth-utils";

export const teamBalanceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number().optional(),
        balanceType: z.string(),
        type: z.string(),
        teamId: z.string(),
        clerkId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isUserManager = await AuthUtil.isUserManager(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );

      if (!isUserManager) throw new TRPCError({ code: "FORBIDDEN" });
      const data = await ctx.prisma.teamBalance.create({
        data: {
          name: input.name,
          description: input.description,
          type: input.type,
          price: input.price,
          teamId: input.teamId,
          clerkId: input.clerkId,
        },
      });
      return data;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        teamBalanceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dataToDelete = await ctx.prisma.teamBalance.findFirst({
        where: {
          id: input.teamBalanceId,
        },
      });
      const isUserManager = await AuthUtil.isUserManager(
        ctx.prisma,
        dataToDelete?.teamId,
        ctx.auth.userId
      );

      if (!isUserManager) throw new TRPCError({ code: "FORBIDDEN" });
      return await ctx.prisma.teamBalance.delete({
        where: {
          id: input.teamBalanceId,
        },
      });
    }),
  // todo
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
      const isUserMember = await AuthUtil.isUserTeamMember(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );
      if (!isUserMember) throw new TRPCError({ code: "FORBIDDEN" });
      const list = await ctx.prisma.teamBalance.findMany({
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
