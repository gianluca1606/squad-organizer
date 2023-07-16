import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { SPONSOR } from '~/utils/constants';

export const statisticRouter = createTRPCRouter({
    get: protectedProcedure
        .input(
            z.object({
                teamId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            // get all entries for this team
            const teamBalanceEntries = await ctx.prisma.teamBalance.findMany({
                where: {
                    teamId: input.teamId,
                },
            });

            // sum up all entries
            const actualBalance = teamBalanceEntries.reduce((acc, curr) => {
                if (curr.price && curr.payed) {
                    return acc + curr.price;
                }
                return acc;
            }, 0);

            const allNotPayedEntriesValue = teamBalanceEntries.reduce((acc, curr) => {
                if (curr.price && curr.price > 0 && !curr.payed) {
                    return acc + curr.price;
                }
                return acc;
            }, 0);

            const totalVolume = teamBalanceEntries.reduce((acc, curr) => {
                if (curr.price) {
                    return acc + Math.abs(curr.price);
                }
                return acc;
            }, 0);

            // find the highest entry of type SPONSOR
            const highestSponsorEntry = await ctx.prisma.teamBalance.findFirst({
                where: {
                    teamId: input.teamId,
                    entryType: SPONSOR,
                },
                orderBy: {
                    price: 'desc',
                },
            });

            return {
                actualBalance,
                allNotPayedEntriesValue,
                highestSponsorEntry,
                totalVolume,
            };
        }),
});
