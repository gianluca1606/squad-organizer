import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { AuthUtil } from "~/utils/auth-utils";

export const userRouter = createTRPCRouter({
  delete: protectedProcedure.mutation(async ({ ctx, input }) => {
    await clerkClient.users.deleteUser(ctx.auth.userId);
  }),

  turnUserIntoManager: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        clerkId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // check if user is manager first
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

      const canEditPunishmentsOrContributions = !!(
        isUserOwner || isUserManager
      );

      if (!canEditPunishmentsOrContributions)
        throw new TRPCError({ code: "FORBIDDEN" });

      // check if user is already manager
      const isUserAlreadyManager = await AuthUtil.isUserManager(
        ctx.prisma,
        input.teamId,
        input.clerkId
      );

      if (isUserAlreadyManager) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already a manager",
        });
      }

      // check if user is already team member
      const isUserAlreadyTeamMember = await AuthUtil.isUserTeamMember(
        ctx.prisma,
        input.teamId,
        input.clerkId
      );

      if (!isUserAlreadyTeamMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not a team member",
        });
      }

      // turn user into manager
      await ctx.prisma.role.create({
        data: {
          teamId: input.teamId,
          name: "MANAGER",
          clerkId: input.clerkId,
        },
      });

      return;
    }),

  removeFromTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        clerkId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // check if user is already team member
      const isUserAlreadyTeamMember = await AuthUtil.isUserTeamMember(
        ctx.prisma,
        input.teamId,
        input.clerkId
      );

      if (!isUserAlreadyTeamMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not a team member",
        });
      }

      // remove user from team
      const data = await ctx.prisma.teamMember.delete({
        where: {
          clerkId_teamId: {
            clerkId: input.clerkId,
            teamId: input.teamId,
          },
        },
      });

      return;
    }),
});
