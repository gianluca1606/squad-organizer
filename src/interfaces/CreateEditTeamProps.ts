import { Team } from "@prisma/client";
import { ModalProps } from "./ModalProps";

export type CreateEditTeamProps = ModalProps & {
  data: Team | null | undefined;
  edit: boolean;
};
