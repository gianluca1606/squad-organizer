import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import CreateTeamForm from '~/components/forms/CreateTeamForm';
import PunishmentsAndContributionsTable from '~/components/lists/PunishmentsAndContributionsTable';
import TeamMembersList from '~/components/lists/TeamMembersList';

import { PunishmentOrContributionType } from '@prisma/client';
import { DeleteTeamDialog } from '~/components/forms/DeleteTeamDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { useToast } from '~/components/ui/use-toast';
import { api } from '~/utils/api';
import { ReceivedJoinRequests } from '../ReceivedJoinRequests';
import { CreateOrEditPunishmentOrContributionDialog } from '../forms/CreateOrEditPunishmentDialog';
import { useLocalStorage } from '@mantine/hooks';

export const Team = () => {
    const { toast } = useToast();
    const [actualTeam, setActualTeamFunction] = useLocalStorage({
        defaultValue: '',
        key: 'teamId',
    });
    const [value, copy] = useCopyToClipboard();

    const [linkToShare, setLinkToShare] = useState('');
    const [punishmentsAndContributionListData, setPunishmentOrContributionListData] = useState<
        PunishmentOrContributionType[]
    >([]);
    const punishmentsAndContributionList = api.team.getAllContributionsAndPunishmentsForTeam.useQuery(
        {
            teamId: actualTeam,
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: actualTeam !== '',
            onSuccess: (data) => {
                setPunishmentOrContributionListData(data.punishmentsOrContributions);
            },
        }
    );
    const teamData = api.team.getTeamData.useQuery(
        { teamId: actualTeam },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: actualTeam !== '',
            onSuccess: (data) => {
                setLinkToShare(window.location.host + '/teams/join?teamId=' + actualTeam);
            },
        }
    );

    useEffect(() => {
        if (punishmentsAndContributionList.data) {
            setPunishmentOrContributionListData(punishmentsAndContributionList.data.punishmentsOrContributions);
        }
    }, [punishmentsAndContributionList.data]);

    useEffect(() => {
        teamData.refetch();
    }, [actualTeam]);

    const copyToClipBoard = () => {
        copy(linkToShare);
        toast({
            title: 'Link Copied',
        });
    };
    return (
        <div className=" flex w-full flex-col items-center">
            <Card className="relative mt-4 block w-full p-0 sm:w-full  md:p-6 xl:w-10/12 2xl:w-8/12">
                <CardHeader>
                    {actualTeam ? (
                        <>
                            <CardTitle> {teamData.data?.name}</CardTitle>
                            <CardDescription>{teamData.data?.description}</CardDescription>
                        </>
                    ) : (
                        <CardTitle> Create or join a team</CardTitle>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="absolute  right-0 top-0 ">
                        <CreateTeamForm
                            refetchTeamData={teamData.refetch}
                            edit={false}
                            data={teamData.data}></CreateTeamForm>
                        {actualTeam && teamData.data?.isUserOwner && (
                            <>
                                <CreateTeamForm
                                    refetchTeamData={teamData.refetch}
                                    edit={true}
                                    data={teamData.data}></CreateTeamForm>
                                <DeleteTeamDialog></DeleteTeamDialog>
                            </>
                        )}
                    </div>

                    <address className="font-normal text-gray-700 dark:text-gray-400">
                        {teamData.data?.location}
                    </address>
                    <br />

                    {actualTeam && (
                        <>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                Share this link with your team members:
                            </p>
                            <Input
                                type="text"
                                name="shareurl"
                                id="share-team-url"
                                readOnly={true}
                                onClick={copyToClipBoard}
                                value={linkToShare}
                                className="cursor-pointer"
                            />
                            <TeamMembersList></TeamMembersList>
                        </>
                    )}
                </CardContent>
            </Card>

            {actualTeam && (
                <Card className="relative mt-4 block w-full p-0 sm:w-full md:p-6 xl:w-10/12 2xl:w-8/12">
                    <CardHeader>
                        <CardTitle> Strafenkatalog / Mannschaftsbeitraege</CardTitle>
                        <CardDescription>
                            Here you can see all punishments and contributions types of your squad
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="absolute  right-0 top-0 ">
                            <CreateOrEditPunishmentOrContributionDialog
                                refetchPunishmentAndContributionList={() => {
                                    punishmentsAndContributionList.refetch();
                                }}
                                edit={false}
                                data={null}></CreateOrEditPunishmentOrContributionDialog>
                        </div>
                        <PunishmentsAndContributionsTable
                            data={punishmentsAndContributionListData}
                            refetchPunishmentAndContributionList={() => {
                                punishmentsAndContributionList.refetch();
                            }}
                            loading={punishmentsAndContributionList.isLoading}
                            isUserManager={teamData.data?.isUserManager}
                            isUserOwner={teamData.data?.isUserOwner}
                        />
                    </CardContent>
                </Card>
            )}
            {(teamData.data?.isUserManager || teamData.data?.isUserOwner) && <ReceivedJoinRequests />}
        </div>
    );
};
