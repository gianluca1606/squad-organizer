import { clerkClient } from "@clerk/nextjs/server";
import { TeamBalance } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PublicUser } from "~/interfaces/PublicUser";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { AuthUtil } from "~/utils/auth-utils";
import { getNameOrMail } from "~/utils/getNameOrMail";

export const teamBalanceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        description: z.string(),
        sponsorName: z.string().optional(),
        price: z.number().optional(),
        entryType: z.string(),
        teamId: z.string(),
        clerkId: z.string(),
        payed: z.string().transform((value) => {
          if (value === "on") return true;
          if (value === "off") return false;
          return false;
        }),
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
      let result: TeamBalance | null = null;
      if (input.entryType === "sponsor") {
        result = await ctx.prisma.teamBalance.create({
          data: {
            name: "sponsor",
            description: input.description,
            entryType: input.entryType,
            price: input.price ? Math.abs(input.price!) : undefined,
            teamId: input.teamId,
            sponsorName: input.sponsorName,
            payed: input.payed,
            id: input.id,
          },
        });
        return result;
      }
      if (input.entryType === "punishmentOrContribution") {
        result = await ctx.prisma.teamBalance.create({
          data: {
            name: input.name,
            description: input.description,
            entryType: input.entryType,
            price: input.price ? Math.abs(input.price!) : undefined,
            teamId: input.teamId,
            clerkId: input.clerkId,
            payed: input.payed,
            id: input.id,
          },
        });
      }

      if (input.entryType === "expenses") {
        result = await ctx.prisma.teamBalance.create({
          data: {
            name: "expenses",
            description: input.description,
            entryType: input.entryType,
            price: -Math.abs(input.price!),
            teamId: input.teamId,
            payed: input.payed,
            clerkId: input.clerkId,
            id: input.id,
          },
        });
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        teamBalanceEntryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dataToDelete = await ctx.prisma.teamBalance.findFirst({
        where: {
          id: input.teamBalanceEntryId,
        },
      });
      const isUserManager = await AuthUtil.isUserManager(
        ctx.prisma,
        dataToDelete?.teamId,
        ctx.auth.userId
      );

      const isUserOwner = await AuthUtil.isUserOwner(
        ctx.prisma,
        dataToDelete?.teamId,
        ctx.auth.userId
      );

      const canEditPunishmentsOrContributions = !!(
        isUserOwner || isUserManager
      );

      if (!canEditPunishmentsOrContributions)
        throw new TRPCError({ code: "FORBIDDEN" });
      return await ctx.prisma.teamBalance.delete({
        where: {
          id: input.teamBalanceEntryId,
        },
      });
    }),
  // TODO
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

      const listWithClerks = await Promise.all(
        list.map(async (item) => {
          if (item.clerkId) {
            // TODO clerk to much data is sent here
            const clerk = await clerkClient.users.getUser(item.clerkId);
            const publicUser: PublicUser = {
              ...clerk,
            };
            return {
              ...item,
              userName: getNameOrMail(publicUser),
              publicUser,
            };
          }
          return {
            ...item,
            userName: item.sponsorName,
            publicUser: null,
          };
        })
      );

      const isUserManager = AuthUtil.isUserManager(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );

      const isUserOwner = AuthUtil.isUserOwner(
        ctx.prisma,
        input.teamId,
        ctx.auth.userId
      );

      return {
        listWithClerks,
        isUserManager: !!isUserManager,
        isUserOwner: !!isUserOwner,
      };
    }),
});
