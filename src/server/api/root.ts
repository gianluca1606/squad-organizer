import { createTRPCRouter } from '~/server/api/trpc';
import { teamRouter } from './routers/team';
import { userRouter } from './routers/user';
import { joinRequestRouter } from './routers/joinRequest';
import { punishmentOrContributionTypeRouter } from './routers/punishmentsAndContributionType';
import { teamBalanceRouter } from './routers/teamBalance';
import { statisticsRouter } from './routers/statistics';

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
    statistics: statisticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
