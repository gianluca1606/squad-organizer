import { useLocalStorage } from '@mantine/hooks';
import { CheckedState } from '@radix-ui/react-checkbox';
import { DialogClose } from '@radix-ui/react-dialog';
import { Edit, Loader2, Plus } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { useToast } from '~/components/ui/use-toast';
import { RouterInputs, RouterOutputs, api } from '~/utils/api';
import { SPONSOR } from '~/utils/constants';
import { getNameOrMail } from '~/utils/getNameOrMail';

type CreateOrUpDateTeamBalanceEntry = RouterInputs['teamBalance']['create'];
type UpdateTeamBalanceEntry = RouterOutputs['teamBalance']['getAllForTeam']['listWithClerks']['0'];
type CreateEditBalanceProps = {
    edit: boolean;
    data?: CreateOrUpDateTeamBalanceEntry | UpdateTeamBalanceEntry | undefined;
    allMembers: RouterOutputs['team']['getMembers'] | undefined;
    punishmentsAndContributionList: RouterOutputs['team']['getAllContributionsAndPunishmentsForTeam'] | undefined;
    refetchBalanceEntries: () => void;
};
export const CreateOrEditTeamBalanceEntry: FC<CreateEditBalanceProps> = ({
    edit,
    data,
    allMembers,
    punishmentsAndContributionList,
    refetchBalanceEntries,
}) => {
    const { toast } = useToast();

    const [actualTeam, setActualTeamFunction] = useLocalStorage({
        defaultValue: '',
        key: 'teamId',
    });
    const statisticsQueryResult = api.statistic.get.useQuery(
        {
            teamId: actualTeam,
        },
        {
            enabled: false,
        }
    );
    const { register, handleSubmit, setValue, reset, getValues, watch } = useForm<CreateOrUpDateTeamBalanceEntry>();

    const [runAgain, setRunAgain] = useState(false);

    const createBalanceEntry = api.teamBalance.create.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'Balance Entry created',
            });
            reset();
            setRunAgain(!runAgain);
            refetchBalanceEntries();
            statisticsQueryResult.refetch();
        },
    });
    const editBalanceEntry = api.teamBalance.update.useMutation({
        onSuccess: (data) => {
            toast({
                title: 'Balance Entry updated',
            });
            reset();
            refetchBalanceEntries();
            statisticsQueryResult.refetch();
        },
    });

    const save = () => {
        handleSubmit(onSubmit)();
    };

    useEffect(() => {
        if (edit && data) {
            setValue('name', data!.name);
            setValue('description', data?.description ? data?.description : '');
            setValue('price', data?.price ? data?.price : 0);
            setValue('teamId', data?.teamId ? data?.teamId : '');
            setValue('clerkId', data?.clerkId ? data?.clerkId : '');
            setValue('sponsorName', data?.sponsorName ? data?.sponsorName : '');
            setValue('description', data?.description ? data?.description : '');
            setValue('entryType', data?.entryType ? data?.entryType : '');
            setValue('payed', data?.payed ? 'on' : 'off');
        }
    }, [data]);

    useEffect(() => {
        if (!edit) {
            setValue('teamId', actualTeam);
            setValue('entryType', 'punishmentOrContribution');
            if (
                punishmentsAndContributionList?.punishmentsOrContributions &&
                punishmentsAndContributionList?.punishmentsOrContributions.length > 0
            ) {
                setValue('name', punishmentsAndContributionList?.punishmentsOrContributions[0]!.name!);

                setValue('price', punishmentsAndContributionList?.punishmentsOrContributions[0]!.price!);
            }
            if (allMembers && allMembers.length > 0) {
                setValue('clerkId', allMembers[0]!.id);
            }
        }
    }, [actualTeam, punishmentsAndContributionList, allMembers, runAgain]);

    const setMemberName = (memberId: string) => {
        setValue('clerkId', memberId);
    };

    const setEntryType = (entryType: string) => {
        setValue('entryType', entryType);
    };
    const setPunishmentOrContributionName = (name: string) => {
        setValue('name', name);

        let price = punishmentsAndContributionList?.punishmentsOrContributions.find(
            (punishmentOrContribution) => punishmentOrContribution.name === name
        )?.price;
        if (!price) {
            price = 0;
        }
        setValue('price', price);
    };

    const setPayedValue = (checked: CheckedState) => {
        checked.valueOf() ? setValue('payed', 'on') : setValue('payed', 'off');
    };

    const onSubmit = (formData: CreateOrUpDateTeamBalanceEntry) => {
        if (edit) {
            editBalanceEntry.mutate({
                ...formData,
                id: data?.id,
            });
        } else {
            createBalanceEntry.mutate(formData);
        }
    };
    return (
        <Dialog modal={true}>
            <DialogTrigger asChild>
                <Button variant="ghost">{edit ? <Edit className="h-4 w-4" /> : <Plus className="h-5 w-5 " />}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Balance entry</DialogTitle>
                    <DialogDescription>Create a new balance entry for your squad</DialogDescription>
                </DialogHeader>
                <form className="w-full">
                    <Label htmlFor="teamname">Entry type</Label>
                    <Select required value={watch('entryType')} onValueChange={setEntryType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an entry type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="punishmentOrContribution">Punishment or Contribution</SelectItem>
                            <SelectItem value="sponsor">Sponsor</SelectItem>
                            <SelectItem value="expenses">Ausgabe</SelectItem>
                        </SelectContent>
                    </Select>
                    {(watch('entryType') === 'punishmentOrContribution' || watch('entryType') === 'expenses') && (
                        <>
                            <Label htmlFor="teamname">Member</Label>
                            <Select value={watch('clerkId')} onValueChange={setMemberName}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allMembers &&
                                        allMembers.map((member) => (
                                            <SelectItem value={member.id} key={member.id}>
                                                {getNameOrMail(member)}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </>
                    )}

                    {watch('entryType') === SPONSOR && (
                        <>
                            <Label htmlFor="sponsorname">Sponsorname</Label>
                            <Input
                                type="text"
                                id="sponsor"
                                placeholder="Sponsorname"
                                required
                                {...register('sponsorName', { required: true })}
                            />
                        </>
                    )}

                    {watch('entryType') === 'punishmentOrContribution' && (
                        <>
                            <Label htmlFor="teamname">Punishment or Contribution Type</Label>
                            <Select
                                disabled={punishmentsAndContributionList?.punishmentsOrContributions.length === 0}
                                value={watch('name')}
                                onValueChange={setPunishmentOrContributionName}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {punishmentsAndContributionList?.punishmentsOrContributions.map(
                                        (punishmentOrContribution) => (
                                            <SelectItem
                                                value={punishmentOrContribution.name}
                                                key={punishmentOrContribution.id}>
                                                {punishmentOrContribution.name}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </>
                    )}
                    <div>
                        <label
                            htmlFor="message"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Your description
                        </label>
                        <Textarea
                            id="message"
                            placeholder="Write your thoughts here.."
                            {...register('description', { required: true })}
                            rows={4}
                        />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="teamname">Price</Label>
                        <Input
                            type="number"
                            id="price"
                            placeholder="price"
                            required
                            {...register('price', { required: true, valueAsNumber: true })}
                        />
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="payed" className="mr-4">
                            Payed?
                        </Label>
                        <Checkbox
                            className="border-white"
                            onCheckedChange={setPayedValue}
                            {...register('payed')}
                            checked={watch('payed') === 'on' ? true : false}
                        />
                    </div>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant={'outline'}
                            disabled={createBalanceEntry.isLoading || editBalanceEntry.isLoading}
                            onClick={save}>
                            {createBalanceEntry.isLoading || editBalanceEntry.isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
