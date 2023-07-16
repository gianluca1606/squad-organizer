import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { AuthUtil } from '~/utils/auth-utils';

export const appointmentRouter = createTRPCRouter({
    createTraining: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                day: z.number(),
                date: z.date().optional(),
                teamId: z.string(),
                clerkId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const isUserManagerOrOwner = await AuthUtil.isUserManagerOrOwner(ctx.prisma, input.teamId, ctx.auth.userId);
            if (!isUserManagerOrOwner) throw new TRPCError({ code: 'FORBIDDEN' });
        }),

    editTraining: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                day: z.number(),
                date: z.date().optional(),
                teamId: z.string(),
                clerkId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const isUserManagerOrOwner = await AuthUtil.isUserManagerOrOwner(ctx.prisma, input.teamId, ctx.auth.userId);
            if (!isUserManagerOrOwner) throw new TRPCError({ code: 'FORBIDDEN' });
        }),

    createEvent: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                day: z.number(),
                date: z.date().optional(),
                teamId: z.string(),
                clerkId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const isUserManagerOrOwner = await AuthUtil.isUserManagerOrOwner(ctx.prisma, input.teamId, ctx.auth.userId);
            if (!isUserManagerOrOwner) throw new TRPCError({ code: 'FORBIDDEN' });
        }),

    editEvent: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                day: z.number(),
                date: z.date().optional(),
                teamId: z.string(),
                clerkId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const isUserManagerOrOwner = await AuthUtil.isUserManagerOrOwner(ctx.prisma, input.teamId, ctx.auth.userId);
            if (!isUserManagerOrOwner) throw new TRPCError({ code: 'FORBIDDEN' });
        }),

    cancelTrainingOrEvent: protectedProcedure
        .input(
            z.object({
                teamBalanceEntryId: z.string(),
                teamId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const isUserManagerOrOwner = await AuthUtil.isUserManagerOrOwner(ctx.prisma, input.teamId, ctx.auth.userId);

            if (!isUserManagerOrOwner) throw new TRPCError({ code: 'FORBIDDEN' });
        }),

    getAllTrainingAppointments: protectedProcedure
        .input(
            z.object({
                teamId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {}),

    getUpcomingEvents: protectedProcedure
        .input(
            z.object({
                teamId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {}),
});
