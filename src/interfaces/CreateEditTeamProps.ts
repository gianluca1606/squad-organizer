import { Team } from "@prisma/client";

export type CreateEditTeamProps = {
  data: TeamDataWithAlreadyInTeam | null | undefined;
  edit: boolean;
};

export type TeamDataWithAlreadyInTeam = Team & {
  isUserAlreadyInTeam: boolean;
  userRequestedToJoinTeam: boolean;
};
