import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { SPONSOR } from '~/utils/constants';

export const statisticsRouter = createTRPCRouter({
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
            const total = teamBalanceEntries.reduce((acc, curr) => {
                if (curr.price) {
                    return acc + curr.price;
                }
                return acc;
            }, 0);

            // now sum up the payed entries
            const payed = teamBalanceEntries.reduce((acc, curr) => {
                if (curr.payed && curr.price) {
                    return acc + curr.price;
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
                totalRevenue: total,
                payedRevenue: payed,
                highestSponsorEntry,
            };
        }),
});
