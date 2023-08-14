'use client';

import { type Row } from '@tanstack/react-table';

import { type RouterOutputs } from '@/utils/api';
import { CreateOrEditTeamBalanceEntry } from '../forms/CreateOrEditTeamBalanceEntry';
import { DeleteBalanceEntryDialog } from '../forms/DeleteBalanceEntryDialog';

type TeamBalanceList = RouterOutputs['teamBalance']['getAllForTeam']['listWithClerks']['0'];

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
    allMembers: RouterOutputs['team']['getMembers'] | undefined;
    punishmentsAndContributionList: RouterOutputs['team']['getAllContributionsAndPunishmentsForTeam'] | undefined;
    refetchBalanceEntries: () => void;
}

export function DataTableRowActions<TData>({
    row,
    allMembers,
    punishmentsAndContributionList,
    refetchBalanceEntries,
}: DataTableRowActionsProps<TData>) {
    const transaction = row.original as TeamBalanceList;

    return (
        <>
            <CreateOrEditTeamBalanceEntry
                refetchBalanceEntries={refetchBalanceEntries}
                punishmentsAndContributionList={punishmentsAndContributionList}
                allMembers={allMembers}
                edit={true}
                data={transaction}></CreateOrEditTeamBalanceEntry>

            <DeleteBalanceEntryDialog
                refetchBalanceEntries={refetchBalanceEntries}
                teamBalanceEntryId={transaction.id}
            />
        </>
    );
}
