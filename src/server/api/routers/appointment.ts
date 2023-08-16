import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { AuthUtil } from '@/utils/auth-utils';

export const appointmentRouter = createTRPCRouter({
    createTraining: protectedProcedure
        .input(
            z.object({
                date: z.date(),
                teamId: z.string(),
                recurring: z.boolean(),
                description: z.string(),
                type: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const isUserManagerOrOwner = await AuthUtil.isUserManagerOrOwner(ctx.prisma, input.teamId, ctx.auth.userId);
            if (!isUserManagerOrOwner) throw new TRPCError({ code: 'FORBIDDEN' });

            const newAppointment = await ctx.prisma.appointment.create({
                data: {
                    // Construct data object based on input
                    date: input.date,
                    teamId: input.teamId,
                    recurring: input.recurring,
                    description: input.description,
                    type: input.type,
                },
            });

            return newAppointment;
        }),

    editTraining: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                teamId: z.string(),
                isDeleted: z.boolean(),
                description: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const isUserManagerOrOwner = await AuthUtil.isUserManagerOrOwner(ctx.prisma, input.teamId, ctx.auth.userId);
            if (!isUserManagerOrOwner) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            // Fetch the training appointment by ID
            const trainingAppointment = await ctx.prisma.appointment.findUnique({
                where: { id: input.id },
            });

            if (!trainingAppointment) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            // Update the appointment based on the input
            const updatedTraining = await ctx.prisma.appointment.update({
                where: { id: input.id },
                data: {
                    deleted: input.isDeleted,
                    description: input.description,
                },
            });

            return updatedTraining;
        }),

    changeAppointment: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                teamId: z.string(),
                // Add any other properties you want to modify here
                // For example: day: z.number().optional(),
                // date: z.date().optional(),
                // clerkId: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const isUserManagerOrOwner = await AuthUtil.isUserManagerOrOwner(ctx.prisma, input.teamId, ctx.auth.userId);
            if (!isUserManagerOrOwner) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            // Fetch the appointment by ID
            const appointment = await ctx.prisma.appointment.findUnique({
                where: { id: input.id },
            });

            if (!appointment) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            // Update the appointment based on the input
            const updatedAppointment = await ctx.prisma.appointment.update({
                where: { id: input.id },
                data: {
                    // Update other properties based on the input
                    // For example: day: input.day,
                    // date: input.date,
                    // clerkId: input.clerkId,
                },
            });

            return updatedAppointment;
        }),

    getUpcomingNonRecurringEvents: protectedProcedure
        .input(
            z.object({
                teamId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const isTeamMember = await AuthUtil.isUserTeamMember(ctx.prisma, input.teamId, ctx.auth.userId);
            if (!isTeamMember) throw new TRPCError({ code: 'FORBIDDEN' });

            const now = new Date();

            const nonRecurringEvents = await ctx.prisma.appointment.findMany({
                where: {
                    teamId: input.teamId,
                    recurring: false,
                    date: {
                        gte: now,
                    },
                },
                take: 10,
                orderBy: {
                    date: 'asc',
                },
            });

            return nonRecurringEvents;
        }),
});
