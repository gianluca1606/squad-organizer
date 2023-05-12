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
    return prisma.role.findFirst({
      where: { teamId: teamId, clerkId, name: "MANAGER" },
    });
  };

  public static isUserOwner = (
    prisma: PrismaClient,
    teamId: string | undefined,
    clerkId: string
  ) => {
    return prisma.role.findFirst({
      where: { teamId: teamId, clerkId, name: "OWNER" },
    });
  };
}
