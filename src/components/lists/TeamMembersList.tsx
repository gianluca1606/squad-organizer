import { useLocalStorage } from '@mantine/hooks';
import { type ChangeEvent, type FC, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { type PublicUser } from '@/interfaces/PublicUser';
import { api } from '@/utils/api';
import { getNameOrMail } from '@/utils/getNameOrMail';
import UserListDropDown from '../UserListDropDown';
import { SkeletonList } from './SkeletonList';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const TeamMembersList: FC = () => {
    const [actualTeam] = useLocalStorage({
        defaultValue: '',
        key: 'teamId',
    });
    const [listData, setListData] = useState<PublicUser[] | null | undefined>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedValue = useDebounce<string>(searchValue, 500);

    const teamMembers = api.team.getMembers.useQuery(
        { teamId: actualTeam },
        {
            enabled: actualTeam !== '',
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );
    useEffect(() => {
        if (teamMembers.data) {
            setListData(teamMembers.data);
            searchValue && setSearchValue('');
        }
    }, [teamMembers.data]);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    useEffect(() => {
        const filteredData = teamMembers.data?.filter((member) => {
            const name = getNameOrMail(member);
            return name?.toLowerCase().includes(debouncedValue.toLowerCase());
        });
        setListData(filteredData);
    }, [debouncedValue]);
    return (
        <Card className="relative mt-4 block w-full p-6  sm:w-full">
            <CardHeader>
                <CardTitle> Squad Members</CardTitle>
                <CardDescription>Here you can see your squad members and manage your team</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="sm:flex">
                    <div className="mb-3  items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
                        <div className="relative mb-4  mt-1 lg:w-64 lg:pr-3 xl:w-96">
                            <label
                                htmlFor="default-search"
                                className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Search
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg
                                        aria-hidden="true"
                                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <Input
                                    value={searchValue}
                                    onChange={handleChange}
                                    placeholder="Search for members"
                                    className="block rounded-lg border text-sm"
                                    disabled={teamMembers.isLoading}
                                    type="search"
                                    id="default-search"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div id="fullWidthTabContent" className="border-t border-gray-200 dark:border-gray-600">
                    <div className="pt-4" id="faq" role="tabpanel" aria-labelledby="faq-tab">
                        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                            {teamMembers.isLoading && <SkeletonList />}
                            {listData?.map((member) => (
                                <li className="py-3 sm:py-4" key={member.id}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex min-w-0 items-center">
                                            <UserListDropDown member={member} />

                                            <div className="ml-3">
                                                <div className="truncate font-medium text-gray-900 dark:text-white">
                                                    <HoverCard>
                                                        <HoverCardTrigger>{getNameOrMail(member)}</HoverCardTrigger>
                                                        <HoverCardContent>
                                                            {member.birthday + 'Member joined at' + member.updatedAt}
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                </div>
                                                {member.isManager && <Badge variant="secondary">Manager</Badge>}
                                                {member.isOwner && <Badge variant="secondary">Owner</Badge>}
                                                {!member.isManager && !member.isOwner && (
                                                    <Badge variant="secondary">Member</Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            {member.totalMoneySpent} €
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TeamMembersList;
