import { PrismaClient } from "@prisma/client";

export class AuthUtil {
  public static isUserTeamMember = (
    prisma: PrismaClient,
    teamId: string | undefined,
    clerkId: string
  ) => {
    return prisma.teamMember.findFirst({
      where: { teamId: teamId, clerkId: clerkId },
    });
  };

  public static isUserManager = (
    prisma: PrismaClient,
    teamId: string | undefined,
    clerkId: string
  ) => {
    return prisma.teamManager.findFirst({
      where: { teamId: teamId, clerkId },
    });
  };
}
