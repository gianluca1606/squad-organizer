import { Team } from "@prisma/client";
import { ModalProps } from "./ModalProps";

export type CreateEditTeamProps = ModalProps & {
  data: TeamDataWithAlreadyInTeam | null | undefined;
  edit: boolean;
};

export type TeamDataWithAlreadyInTeam = Team & {
  isUserAlreadyInTeam: boolean;
};
