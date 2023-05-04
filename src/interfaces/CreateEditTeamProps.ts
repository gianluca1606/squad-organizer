import { Team } from "@prisma/client";
import { RouterOutputs } from "~/utils/api";

type GetTeamData = RouterOutputs["team"]["getTeamData"];
export type CreateEditTeamProps = {
  data: GetTeamData | null | undefined;
  edit: boolean;
};

export type TeamDataWithAlreadyInTeam = Team & {
  isUserAlreadyInTeam: boolean;
  userRequestedToJoinTeam: boolean;
};
