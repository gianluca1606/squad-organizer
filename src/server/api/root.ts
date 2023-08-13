import { createTRPCRouter } from '@/server/api/trpc';
import { teamRouter } from '@/server/api/routers/team';
import { userRouter } from '@/server/api//routers/user';
import { joinRequestRouter } from '@/server/api//routers/joinRequest';
import { punishmentOrContributionTypeRouter } from '@/server/api//routers/punishmentsAndContributionType';
import { teamBalanceRouter } from '@/server/api//routers/teamBalance';
import { statisticRouter } from '@/server/api//routers/statistics';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    user: userRouter,
    punishmentOrContributionType: punishmentOrContributionTypeRouter,
    team: teamRouter,
    joinRequest: joinRequestRouter,
    teamBalance: teamBalanceRouter,
    statistic: statisticRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
