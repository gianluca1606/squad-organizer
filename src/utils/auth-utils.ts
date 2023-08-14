import { type PrismaClient } from '@prisma/client';

export class AuthUtil {
    static async isUserTeamMember(prisma: PrismaClient, teamId: string | undefined, clerkId: string) {
        const isUserTeamMember = await prisma.teamMember.findFirst({
            where: { teamId: teamId, clerkId: clerkId },
        });
        return isUserTeamMember;
    }

    static async isUserManager(prisma: PrismaClient, teamId: string | undefined, clerkId: string) {
        const isUserManager = await prisma.role.findFirst({
            where: { teamId: teamId, clerkId, name: 'MANAGER' },
        });
        return !!isUserManager;
    }

    static async isUserOwner(prisma: PrismaClient, teamId: string | undefined, clerkId: string) {
        const isUserOwner = await prisma.role.findFirst({
            where: { teamId: teamId, clerkId, name: 'OWNER' },
        });
        return !!isUserOwner;
    }

    static async isUserManagerOrOwner(prisma: PrismaClient, teamId: string | undefined, clerkId: string) {
        const isUserManager = await AuthUtil.isUserManager(prisma, teamId, clerkId);

        const isUserOwner = await AuthUtil.isUserOwner(prisma, teamId, clerkId);

        return !!(isUserManager || isUserOwner);
    }
}
