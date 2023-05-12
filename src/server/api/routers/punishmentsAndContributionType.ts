import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { AuthUtil } from "~/utils/auth-utils";

export const punishmentOrContributionTypeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number().optional(),
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isUserManager = await AuthUtil.isUserManager(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );

      const isUserOwner = await AuthUtil.isUserOwner(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );

      const canCreatePunishmentOrContribution = !!(
        isUserOwner || isUserManager
      );

      if (!canCreatePunishmentOrContribution)
        throw new TRPCError({ code: "FORBIDDEN" });
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
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isUserManager = await AuthUtil.isUserManager(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );

      if (!isUserManager) throw new TRPCError({ code: "FORBIDDEN" });
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
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isUserManager = await AuthUtil.isUserManager(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );

      const isUserOwner = await AuthUtil.isUserOwner(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );

      const canEditPunishmentsOrContributions = !!(
        isUserOwner || isUserManager
      );

      if (!canEditPunishmentsOrContributions)
        throw new TRPCError({ code: "FORBIDDEN" });

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
      const isUserInTeam = await AuthUtil.isUserTeamMember(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );
      if (!isUserInTeam) throw new TRPCError({ code: "FORBIDDEN" });
      const list = await ctx.prisma.punishmentOrContributionType.findMany({
        where: {
          teamId: input.teamId,
        },
      });
      const isUserManager = await AuthUtil.isUserManager(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );

      return {
        list,
        isUserManager: !!isUserManager,
      };
    }),
});
