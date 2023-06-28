'use client';

import { Table } from '@tanstack/react-table';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

import { cn } from '~/lib/utils';
import { set } from 'lodash';

const frameworks = [
    {
        value: 'payed',
        label: 'Payed',
    },
    {
        value: 'not payed',
        label: 'Not payed',
    },
];

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const [open, setOpen] = useState(false);
    const [openNameOrSponsor, setOpenNameOrSponsorFilter] = useState(false);
    const [value, setValue] = useState<string | undefined>(undefined);
    const [valueName, setValueName] = useState<string | undefined>(undefined);
    const isColumnUserNameFiltered = table.getColumn('userName')?.getIsFiltered();
    const allUsersOrSponsors = table.getColumn('userName')?.getFacetedUniqueValues();
    const [nameOrSponsors, setNameOrSponsors] = useState<any[]>([]);

    useEffect(() => {
        setNameOrSponsors([]);
        allUsersOrSponsors?.forEach((value, key) => {
            setNameOrSponsors((arr) => [
                ...arr,
                {
                    value: key,
                    label: key,
                },
            ]);
        });
    }, [allUsersOrSponsors]);
    const setStatusFilter = (status: string) => {
        setValue(status === value ? '' : status);
        setOpen(false);

        switch (status) {
            case 'payed':
                table.getColumn('payed')?.setFilterValue('true');
                break;
            case 'not payed':
                table.getColumn('payed')?.setFilterValue('false');
                break;
            default:
                table.getColumn('payed')?.setFilterValue(undefined);
                break;
        }
    };

    const setNameOrSponsorFilter = (input: string) => {
        setValueName(input === valueName ? '' : input);
        setOpenNameOrSponsorFilter(false);
        table.getColumn('userName')?.setFilterValue(input);
    };

    useEffect(() => {
        if (!value) {
            table.getColumn('payed')?.setFilterValue(undefined);
        }
    }, [value]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {nameOrSponsors.length > 0 && (
                    <Popover open={openNameOrSponsor} onOpenChange={setOpenNameOrSponsorFilter}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between">
                                {valueName
                                    ? nameOrSponsors.find((nameOrSponsor) => nameOrSponsor.value === valueName)?.label
                                    : 'Name filter...'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Name filter..." />
                                <CommandEmpty>No options found.</CommandEmpty>
                                <CommandGroup>
                                    {nameOrSponsors.map((nameOrSponsor) => (
                                        <CommandItem
                                            key={nameOrSponsor.value}
                                            onSelect={(currentValue) => {
                                                setNameOrSponsorFilter(currentValue);
                                            }}>
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    valueName === nameOrSponsor.value ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {nameOrSponsor.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between">
                            {value
                                ? frameworks.find((framework) => framework.value === value)?.label
                                : 'Status filter...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Status filter..." />
                            <CommandEmpty>No options found.</CommandEmpty>
                            <CommandGroup>
                                {frameworks.map((framework) => (
                                    <CommandItem
                                        key={framework.value}
                                        onSelect={(currentValue) => {
                                            setStatusFilter(currentValue);
                                        }}>
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === framework.value ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {framework.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
