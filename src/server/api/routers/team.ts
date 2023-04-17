import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
        description: z.string(),
      })
    )
    .mutation(async ({ ctx }) => {
      const dbUser = await ctx.prisma.user.findFirst({
        where: {
          clerkId: ctx.auth.userId,
        },
      });

      if (!dbUser) {
        throw new TRPCError({
          message: "User not found in database",
          code: "NOT_FOUND",
        });
      }
      return dbUser;
    }),

  delete: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.delete({
        where: {
          id: input.userId,
        },
      });
      return user;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    // TODO should only be able to get all users if you're an admin
    return ctx.prisma.user.findMany();
  }),
});
