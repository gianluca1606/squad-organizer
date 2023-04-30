import { Button } from "components/ui/button";
import { Loader2 } from "lucide-react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const router = useRouter();
  const teamData = api.team.getTeamData.useQuery({
    teamId: router.query.teamId as string,
  });

  const joinTeam = api.joinRequest.create.useMutation();

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
      <div className="relative mt-4 block w-full rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800 sm:w-10/12 md:w-8/12 2xl:w-6/12">
        {teamData.isFetched && !teamData.data?.isUserAlreadyInTeam && (
          <Button
            className="absolute right-0 top-0"
            onClick={joinTeamMutation}
            disabled={joinTeam.isLoading}
          >
            {joinTeam.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              " Click here to join team"
            )}
          </Button>
        )}

        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {teamData.data?.name}
        </h5>
        <address className="font-normal text-gray-700 dark:text-gray-400">
          {teamData.data?.location}
        </address>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {teamData.data?.description}
        </p>

        <p className="font-normal text-gray-700 dark:text-gray-400">
          Share this link with your team members:
        </p>
      </div>
    </>
  );
};

export default Home;
