import { PunishmentOrContributionType } from '@prisma/client';
import React from 'react';
import { CreateOrEditPunishmentOrContributionDialog } from '../forms/CreateOrEditPunishmentDialog';
import { DeleteContributionOrPunishmentType } from '../forms/DeleteContributionOrPunishmentDialog';

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

const PunishmentsAndContributionsTable = ({
    data,
    loading,
    refetchPunishmentAndContributionList,
    isUserManager,
    isUserOwner,
}: {
    data: PunishmentOrContributionType[];
    loading: boolean;
    isUserManager: boolean | undefined;
    isUserOwner: boolean | undefined;
    refetchPunishmentAndContributionList: () => void;
}) => {
    const columns: (ColumnDef<PunishmentOrContributionType> | undefined)[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'description',
            header: 'Description',
        },
        {
            accessorKey: 'price',
            header: 'Price',
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('price'));
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EUR',
                }).format(amount);

                return <>{formatted}</>;
            },
        },

        isUserManager || isUserOwner
            ? {
                  header: 'Actions',
                  id: 'actions',

                  cell: ({ row }) => {
                      const punishmentOrContributionType = row.original;

                      return (
                          <>
                              <CreateOrEditPunishmentOrContributionDialog
                                  refetchPunishmentAndContributionList={() => {
                                      refetchPunishmentAndContributionList();
                                  }}
                                  edit={true}
                                  data={punishmentOrContributionType}></CreateOrEditPunishmentOrContributionDialog>
                              <DeleteContributionOrPunishmentType
                                  punishmentOrContributionId={
                                      punishmentOrContributionType.id
                                  }></DeleteContributionOrPunishmentType>
                          </>
                      );
                  },
              }
            : undefined,
    ];
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const isNotUndefined = (
        item: ColumnDef<PunishmentOrContributionType> | undefined
    ): item is ColumnDef<PunishmentOrContributionType> => {
        return !!item;
    };
    const table = useReactTable({
        columns: columns.filter(isNotUndefined) as ColumnDef<PunishmentOrContributionType>[],
        data: data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });
    return (
        <>
            <div className="rounded-md border">
                <div>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
};

export default PunishmentsAndContributionsTable;
