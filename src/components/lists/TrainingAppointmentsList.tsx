import { useLocalStorage } from '@mantine/hooks';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { PublicUser } from '@/interfaces/PublicUser';
import { api } from '@/utils/api';
import { getNameOrMail } from '@/utils/getNameOrMail';
import UserListDropDown from '../UserListDropDown';
import { SkeletonList } from './SkeletonList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from 'react-day-picker';

const TrainingAppointmentsList: FC = () => {
    const [actualTeam, setActualTeamFunction] = useLocalStorage({
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
        <Card className="relative mt-4 block w-full p-6  sm:w-full xl:w-10/12 2xl:w-8/12">
            <CardHeader>
                <CardTitle> Appointments</CardTitle>
                <CardDescription>Here you can see your sent join requests and withdrawn them</CardDescription>
            </CardHeader>
            <CardContent>
                <ul>nothing to see here at the moment</ul>
            </CardContent>
        </Card>
    );
};

export default TrainingAppointmentsList;
