import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const userDetails = await clerkClient.users.getUser(ctx.auth.userId);

    const user = await ctx.prisma.user.create({
      data: {
        clerkId: ctx.auth.userId,
        email: userDetails.emailAddresses[0]!.emailAddress!,
        nickname: userDetails.username,
      },
    });

    return user;
  }),

  delete: protectedProcedure.mutation(async ({ ctx, input }) => {
    await clerkClient.users.deleteUser(ctx.auth.userId);
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
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

    if (dbUser.role !== "ADMIN") {
      throw new TRPCError({
        message: "You are not authorized to perform this action",
        code: "UNAUTHORIZED",
      });
    }

    // TODO should only be able to get all users if you're an admin
    return ctx.prisma.user.findMany();
  }),
});
