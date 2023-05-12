import { useEffect, useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { getNameOrMail } from "~/utils/getNameOrMail";
import { Button } from "~/components/ui/button";
import { Check, X } from "lucide-react";
import { useLocalStorage } from "@mantine/hooks";

export const ReceivedJoinRequests = () => {
  const { toast } = useToast();
  const [actualTeam, setActualTeamFunction] = useLocalStorage({
    defaultValue: "",
    key: "teamId",
  });

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
    },
  });

  const receivedJoinRequests = api.joinRequest.getAllForTeam.useQuery(
    {
      teamId: actualTeam,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: actualTeam !== "",
    }
  );

  const sentJoinRequests = api.joinRequest.getAllForLoggedInUser.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

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

  if (actualTeam) {
    return (
      <Card className="relative mt-4 block w-full p-6  sm:w-full xl:w-10/12 2xl:w-8/12">
        <CardHeader>
          <CardTitle> Received join requests</CardTitle>
          <CardDescription>
            Here you can see all received join requests for the selected team
          </CardDescription>
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
                        {getNameOrMail(joinRequest as any)}
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
                        declineJoinRequestFunction(joinRequest.joinRequestId)
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
    );
  }
  return <div>loading</div>;
};
