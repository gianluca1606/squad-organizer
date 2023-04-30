import { Button } from "components/ui/button";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useLocalStorage } from "usehooks-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { api } from "~/utils/api";
import { getNameOrMail } from "~/utils/getNameOrMail";

const Home: NextPage = () => {
  const router = useRouter();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const acceptJoinRequest = api.joinRequest.accept.useMutation({
    onSuccess: () => {
      router.push("/teams");
    },
    onError: (error) => {
      alert(error);
    },
  });

  const receivedJoinRequests = api.joinRequest.getAllForTeam.useQuery({
    teamId: actualTeam,
  });

  const accpetJoinRequestFunction = (joinRequestId: string | undefined) => {
    if (joinRequestId) {
      acceptJoinRequest.mutate({
        joinRequestId: joinRequestId,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Join requests</title>
        <meta name="description" content="Squad Organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card className="relative mt-4 block w-full  p-6  sm:w-10/12 md:w-8/12 2xl:w-6/12">
        <CardHeader>
          <CardTitle> Sent join requests</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>

      <Card className="relative mt-4 block w-full  p-6  sm:w-10/12 md:w-8/12 2xl:w-6/12">
        <CardHeader>
          <CardTitle> Received join requests</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            {receivedJoinRequests.data?.map((joinRequest) => (
              <li className="py-3 sm:py-4" key={joinRequest.id}>
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center">
                    <img
                      className="h-10 w-10 flex-shrink-0"
                      src={joinRequest.profileImageUrl}
                      alt="imac image"
                    />
                    <div className="ml-3">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {getNameOrMail(joinRequest)}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <Button
                      onClick={() =>
                        accpetJoinRequestFunction(joinRequest.joinRequestId)
                      }
                      className="mr-2 inline-flex items-center rounded-lg bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        fill="none"
                        className="h-5 w-5"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </Button>
                    <button
                      type="button"
                      className="mr-2 inline-flex items-center rounded-lg bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
};

export default Home;
