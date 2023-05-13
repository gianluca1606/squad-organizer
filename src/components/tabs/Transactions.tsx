import { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { useToast } from "~/components/ui/use-toast";
import { CreateOrEditTeamBalanceEntry } from "../forms/CreateOrEditTeamBalanceEntry";
import { RouterOutputs, api } from "~/utils/api";
import { Checkbox } from "~/components/ui/checkbox";
import { getNameOrMail } from "~/utils/getNameOrMail";
import { useLocalStorage, usePagination } from "@mantine/hooks";
import React from "react";
import { DataTablePagination } from "../table/data-table-pagination";
import { z } from "zod";
import { DataTableColumnHeader } from "../table/data-table-column-header";
import { DataTableRowActions } from "../table/data-table-row-actions";
import { DataTableToolbar } from "../table/data-table-toolbar";
import { useTranslations } from "next-intl";

type TeamBalanceList =
  RouterOutputs["teamBalance"]["getAllForTeam"]["listWithClerks"]["0"];
const Transactions: FC = () => {
  const t = useTranslations("Team");

  const { toast } = useToast();
  const [actualTeam, setActualTeamFunction] = useLocalStorage({
    defaultValue: "",
    key: "teamId",
  });
  const punishmentsAndContributionList =
    api.team.getAllContributionsAndPunishmentsForTeam.useQuery(
      {
        teamId: actualTeam,
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: actualTeam !== "",
      }
    );
  const allMembers = api.team.getMembers.useQuery(
    {
      teamId: actualTeam,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: actualTeam !== "",
    }
  );
  const [firstLoad, setFirstLoad] = useState<boolean>(false);

  const allTransactions = api.teamBalance.getAllForTeam.useQuery(
    {
      teamId: actualTeam,
    },
    {
      enabled: actualTeam !== "",
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setBalanceTableData(data.listWithClerks);
      },
    }
  );

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [balanceTableData, setBalanceTableData] = useState<TeamBalanceList[]>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns2: ColumnDef<TeamBalanceList>[] = [
    {
      accessorKey: "userName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name/Sponsor" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue("userName")}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reason" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        return <>{row.getValue("description")}</>;
      },
    },

    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "EUR",
        }).format(amount);

        return <>{formatted}</>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "payed",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payed" />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            className="border-black dark:border-white"
            disabled
            checked={row.getValue("payed")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          allMembers={allMembers.data}
          punishmentsAndContributionList={punishmentsAndContributionList.data}
          refetchBalanceEntries={() => {
            allTransactions.refetch();
          }}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: balanceTableData,
    columns: columns2,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (allTransactions.data && !firstLoad) {
      setFirstLoad(true);
      setBalanceTableData(allTransactions.data.listWithClerks);
    }
  }, [allTransactions.data]);

  return (
    <div className="flex  flex-col items-center ">
      <Card className="relative mt-4 block w-full  p-0 sm:w-full md:p-6 xl:w-10/12 2xl:w-8/12">
        <CardHeader>
          <CardTitle> {t("balance.title")}</CardTitle>
          <CardDescription>{t("balance.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="absolute  right-0 top-0 ">
            {actualTeam && (
              <CreateOrEditTeamBalanceEntry
                refetchBalanceEntries={() => {
                  allTransactions.refetch();
                }}
                punishmentsAndContributionList={
                  punishmentsAndContributionList.data
                }
                edit={false}
                allMembers={allMembers.data}
              />
            )}
          </div>

          <div>
            <div className="space-y-4">
              <DataTableToolbar table={table} />
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns2.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="relative mt-4 block w-full  p-0 sm:w-full md:p-6 xl:w-10/12 2xl:w-8/12">
        <CardHeader>
          <CardTitle> Statistics</CardTitle>
          <CardDescription>Here you can see all the statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                <h3 className="text-sm font-medium tracking-tight">
                  Total Revenue
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <line x1={12} x2={12} y1={2} y2={22} />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                <h3 className="text-sm font-medium tracking-tight">
                  Subscriptions
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx={9} cy={7} r={4} />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                <h3 className="text-sm font-medium tracking-tight">Sales</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width={20} height={14} x={2} y={5} rx={2} />
                  <line x1={2} x2={22} y1={10} y2={10} />
                </svg>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                <h3 className="text-sm font-medium tracking-tight">
                  Active Now
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
