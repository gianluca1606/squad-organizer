import { Button } from 'components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { type NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

import { api } from '@/utils/api';

const Home: NextPage = () => {
    const { toast } = useToast();
    const router = useRouter();
    const teamData = api.team.getTeamData.useQuery({
        teamId: router.query.teamId as string,
    });

    const joinTeam = api.joinRequest.create.useMutation({
        onSuccess: async () => {
            toast({
                title: 'Request sent',
                description: 'Your request has been sent to the team owner',
            });
            await router.push('/dashboard');
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: 'Some error occured, try later again',
                variant: 'destructive',
            });
        },
    });

    const joinTeamMutation = () => {
        joinTeam.mutate({ teamId: router.query.teamId as string });
    };

    return (
        <>
            <Head>
                <title>Join </title>
                <meta name="description" content="Squad Organizer" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex h-full w-full justify-center">
                <Card className="relative mt-4 block w-full p-6  sm:w-10/12 md:w-full lg:w-8/12 2xl:w-6/12">
                    <CardHeader>
                        <CardTitle> {teamData.data?.name} </CardTitle>
                        <CardDescription>{teamData.data?.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Badge>{teamData.data?.location}</Badge>
                        {teamData.isFetched &&
                            !teamData.data?.isUserAlreadyInTeam &&
                            !teamData.data?.userRequestedToJoinTeam && (
                                <Button
                                    variant={'secondary'}
                                    className="absolute right-0 top-0"
                                    onClick={joinTeamMutation}
                                    disabled={joinTeam.isLoading}>
                                    {joinTeam.isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        ' Click here to join team'
                                    )}
                                </Button>
                            )}

                        {teamData.isFetched && teamData.data?.isUserAlreadyInTeam && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Heads up!</AlertTitle>
                                <AlertDescription>You are already in this squad</AlertDescription>
                            </Alert>
                        )}

                        {teamData.isFetched && teamData.data?.userRequestedToJoinTeam && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Heads up!</AlertTitle>
                                <AlertDescription>
                                    You are already requested to join the squad, check with the squad manager to get
                                    into the squad
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Home;
