import { Button } from "components/ui/button";
import { Check, X } from "lucide-react";
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
import { useToast } from "~/components/ui/use-toast";

import { api } from "~/utils/api";
import { getNameOrMail } from "~/utils/getNameOrMail";

const Home: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const acceptJoinRequest = api.joinRequest.accept.useMutation({
    onSuccess: () => {
      toast({
        title: "Join request accepted",
        description: "The user has been added to the team",
      });
      receivedJoinRequests.refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Some error occured try later again or refresh the page",
      });
      alert(error);
    },
  });

  const declineJoinRequest = api.joinRequest.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Join request removed",
        description: "The user has not been added to the team",
      });
      receivedJoinRequests.refetch();
      sentJoinRequests.refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Some error occured try later again or refresh the page",
      });
      alert(error);
    },
  });

  const receivedJoinRequests = api.joinRequest.getAllForTeam.useQuery({
    teamId: actualTeam,
  });

  const sentJoinRequests = api.joinRequest.getAllForLoggedInUser.useQuery();

  const accpetJoinRequestFunction = (joinRequestId: string | undefined) => {
    if (joinRequestId) {
      acceptJoinRequest.mutate({
        joinRequestId: joinRequestId,
      });
    }
  };

  const declineJoinRequestFunction = (joinRequestId: string | undefined) => {
    if (joinRequestId) {
      declineJoinRequest.mutate({
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

      <div className="flex h-full w-full flex-col items-center justify-center">
        <Card className="relative mt-4 block w-full p-6  sm:w-10/12 md:w-full lg:w-8/12 2xl:w-6/12">
          <CardHeader>
            <CardTitle> Sent join requests</CardTitle>
            <CardDescription>
              Here you can see your sent join requests and withdrawn them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {sentJoinRequests.data?.map((joinRequest) => (
                <li className="py-3 sm:py-4" key={joinRequest.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 items-center">
                      <div className="ml-3">
                        <p className="truncate font-medium text-gray-900 dark:text-white">
                          {joinRequest.team.name}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <Button
                        variant={"ghost"}
                        className="p-2.5"
                        onClick={() =>
                          declineJoinRequestFunction(joinRequest.id)
                        }
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {actualTeam && (
          <Card className="relative mt-4 block w-full p-6  sm:w-10/12 md:w-full lg:w-8/12 2xl:w-6/12">
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
                          variant={"ghost"}
                          className="p-2.5"
                          onClick={() =>
                            accpetJoinRequestFunction(joinRequest.joinRequestId)
                          }
                        >
                          <Check className="h-5 w-5" />
                        </Button>
                        <Button
                          variant={"ghost"}
                          className="p-2.5"
                          onClick={() =>
                            declineJoinRequestFunction(
                              joinRequest.joinRequestId
                            )
                          }
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Home;
