import { type FC, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFacetedUniqueValues,
    useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useLocalStorage } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { RouterOutputs, api } from '@/utils/api';
import Statistics from '../Statistics';
import { CreateOrEditTeamBalanceEntry } from '../forms/CreateOrEditTeamBalanceEntry';
import { DataTableColumnHeader } from '../table/data-table-column-header';
import { DataTablePagination } from '../table/data-table-pagination';
import { DataTableRowActions } from '../table/data-table-row-actions';
import { DataTableToolbar } from '../table/data-table-toolbar';

type TeamBalanceList = RouterOutputs['teamBalance']['getAllForTeam']['listWithClerks']['0'];
const Transactions: FC = () => {
    const t = useTranslations('Team');

    const { toast } = useToast();
    const [actualTeam, setActualTeamFunction] = useLocalStorage({
        defaultValue: '',
        key: 'teamId',
    });
    const punishmentsAndContributionList = api.team.getAllContributionsAndPunishmentsForTeam.useQuery(
        {
            teamId: actualTeam,
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: actualTeam !== '',
        }
    );
    const allMembers = api.team.getMembers.useQuery(
        {
            teamId: actualTeam,
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: actualTeam !== '',
        }
    );
    const [firstLoad, setFirstLoad] = useState<boolean>(false);

    const allTransactions = api.teamBalance.getAllForTeam.useQuery(
        {
            teamId: actualTeam,
        },
        {
            enabled: actualTeam !== '',
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setBalanceTableData(data.listWithClerks);
            },
        }
    );

    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [balanceTableData, setBalanceTableData] = useState<TeamBalanceList[]>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns2: ColumnDef<TeamBalanceList>[] = [
        {
            accessorKey: 'userName',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name/Sponsor" />,
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('userName')}</div>,
            enableHiding: false,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Reason" />,
            cell: ({ row }) => <div className="w-[80px] overflow-hidden text-ellipsis">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'description',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
            cell: ({ row }) => {
                return <>{row.getValue('description')}</>;
            },
        },

        {
            accessorKey: 'price',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('price'));
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EUR',
                }).format(amount);

                return <>{formatted}</>;
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: 'payed',
            enableSorting: false,
            header: ({ column }) => <DataTableColumnHeader column={column} title="Payed" />,
            cell: ({ row }) => {
                return <Checkbox className="border-black dark:border-white" disabled checked={row.getValue('payed')} />;
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            id: 'actions',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
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
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
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
                    <CardTitle> {t('balance.title')}</CardTitle>
                    <CardDescription>{t('balance.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="absolute  right-0 top-0 ">
                        {actualTeam && (
                            <CreateOrEditTeamBalanceEntry
                                refetchBalanceEntries={() => {
                                    allTransactions.refetch();
                                }}
                                punishmentsAndContributionList={punishmentsAndContributionList.data}
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
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columns2.length} className="h-24 text-center">
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
            <Statistics />
        </div>
    );
};

export default Transactions;
