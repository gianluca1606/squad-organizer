import { clerkClient } from "@clerk/nextjs/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  delete: protectedProcedure.mutation(async ({ ctx, input }) => {
    await clerkClient.users.deleteUser(ctx.auth.userId);
  }),
});
