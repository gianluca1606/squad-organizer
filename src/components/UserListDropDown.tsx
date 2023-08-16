import { useLocalStorage } from '@mantine/hooks';
import { UserMinus, ShieldCheck, Key } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { type PublicUser } from '@/interfaces/PublicUser';
import { api } from '@/utils/api';

const UserListDropDown = (props: { member: PublicUser }) => {
    const { toast } = useToast();
    const [actualTeam, setActualTeamFunction] = useLocalStorage({
        defaultValue: '',
        key: 'teamId',
    });

    const turnUserIntoManager = api.user.turnUserIntoManager.useMutation({
        onSuccess: () => {
            teamMembers.refetch();
            toast({
                title: 'User turned into manager',
            });
        },
    });
    const turnUserIntoOwner = api.user.turnUserIntoOwner.useMutation({
        onSuccess: () => {
            toast({
                title: 'User turned into owner',
            });
            teamMembers.refetch();
        },
    });
    const removeUserFromTeam = api.user.removeFromTeam.useMutation({
        onSuccess: () => {
            toast({
                title: 'User removed from team',
            });
            teamMembers.refetch();
        },
    });
    const teamMembers = api.team.getMembers.useQuery(
        { teamId: actualTeam },
        {
            enabled: false,
        }
    );

    const removeUserFromTeamFn = () => {
        removeUserFromTeam.mutate({
            teamId: actualTeam,
            clerkId: props.member.id,
        });
    };

    const turnUserIntoManagerFn = () => {
        turnUserIntoManager.mutate({
            teamId: actualTeam,
            clerkId: props.member.id,
        });
    };

    const turnUserIntoOwnerFn = () => {
        turnUserIntoOwner.mutate({
            teamId: actualTeam,
            clerkId: props.member.id,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={props.member.profileImageUrl} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        removeUserFromTeamFn();
                    }}>
                    Remove from team
                    <UserMinus className="ml-2 h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        turnUserIntoManagerFn();
                    }}>
                    Turn into Manager
                    <ShieldCheck className="ml-2 h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        turnUserIntoOwnerFn();
                    }}>
                    Turn into Owner
                    <Key className="ml-2 h-4 w-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default UserListDropDown;
