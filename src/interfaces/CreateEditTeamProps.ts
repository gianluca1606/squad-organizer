import { type Team } from '@prisma/client';
import { type RouterOutputs } from '@/utils/api';

type GetTeamData = RouterOutputs['team']['getTeamData'];
export type CreateEditTeamProps = {
    data: GetTeamData | null | undefined;
    edit: boolean;
    refetchTeamData: () => void;
};

export type TeamDataWithAlreadyInTeam = Team & {
    isUserAlreadyInTeam: boolean;
    userRequestedToJoinTeam: boolean;
};
