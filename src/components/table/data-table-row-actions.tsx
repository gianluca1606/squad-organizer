"use client";

import { Row } from "@tanstack/react-table";
import { Copy, MoreHorizontal, Pen, Star, Tags, Trash } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { z } from "zod";
import { RouterOutputs } from "~/utils/api";
import { CreateOrEditTeamBalanceEntry } from "../forms/CreateOrEditTeamBalanceEntry";
import { DeleteBalanceEntryDialog } from "../forms/DeleteBalanceEntryDialog";

type TeamBalanceList =
  RouterOutputs["teamBalance"]["getAllForTeam"]["listWithClerks"]["0"];

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  allMembers: RouterOutputs["team"]["getMembers"] | undefined;
  punishmentsAndContributionList:
    | RouterOutputs["team"]["getAllContributionsAndPunishmentsForTeam"]
    | undefined;
  refetchBalanceEntries: () => void;
}

export function DataTableRowActions<TData>({
  row,
  allMembers,
  punishmentsAndContributionList,
  refetchBalanceEntries,
}: DataTableRowActionsProps<TData>) {
  let transaction = row.original as TeamBalanceList;

  return (
    <>
      <CreateOrEditTeamBalanceEntry
        refetchBalanceEntries={refetchBalanceEntries}
        punishmentsAndContributionList={punishmentsAndContributionList}
        allMembers={allMembers}
        edit={true}
        data={transaction}
      ></CreateOrEditTeamBalanceEntry>

      <DeleteBalanceEntryDialog
        refetchBalanceEntries={refetchBalanceEntries}
        teamBalanceEntryId={transaction.id}
      />
    </>
  );
}
