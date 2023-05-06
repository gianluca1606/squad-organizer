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
          console.log("logging payed value");
          console.log(value);
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

      if (!isUserManager) throw new TRPCError({ code: "FORBIDDEN" });
      let result: TeamBalance | null = null;
      if (input.entryType === "sponsor") {
        result = await ctx.prisma.teamBalance.create({
          data: {
            name: "sponsor",
            description: input.description,
            entryType: input.entryType,
            price: input.price,
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
            price: input.price,
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
            price: input.price,
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
              publicUser,
            };
          }
          return {
            ...item,
            publicUser: null,
          };
        })
      );

      const isUserManager = await ctx.prisma.teamManager.findFirst({
        where: { teamId: input.teamId, clerkId: ctx.auth.userId },
      });

      return {
        listWithClerks,
        isUserManager: !!isUserManager,
      };
    }),
});
