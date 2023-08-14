import { type PunishmentOrContributionType } from '@prisma/client';

export type CreateEditPusnihmentOrContributionTypeProps = {
    data: PunishmentOrContributionType | null | undefined;
    edit: boolean;
    refetchPunishmentAndContributionList: () => void;
};
