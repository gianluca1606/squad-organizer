import { createTRPCRouter } from "~/server/api/trpc";
import { punishmentAndContributionRouter } from "./routers/punishmentsAndContribution";
import { teamRouter } from "./routers/team";
import { userRouter } from "./routers/user";
import { joinRequestRouter } from "./routers/joinRequest";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  punishmentAndContribution: punishmentAndContributionRouter,
  team: teamRouter,
  joinRequest: joinRequestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
