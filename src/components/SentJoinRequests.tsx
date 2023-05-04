import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import SettingsForm from "./forms/SettingsForm";

export const SentJoinRequests = () => {
  const { toast } = useToast();
  const sentJoinRequests = api.joinRequest.getAllForLoggedInUser.useQuery();

  const declineJoinRequest = api.joinRequest.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Join request removed",
        description: "The user has not been added to the team",
      });
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

  const declineJoinRequestFunction = (joinRequestId: string | undefined) => {
    if (joinRequestId) {
      declineJoinRequest.mutate({
        joinRequestId: joinRequestId,
      });
    }
  };
  return (
    <Card className="relative mt-4 block w-full p-6  sm:w-full xl:w-10/12 2xl:w-8/12">
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
                    onClick={() => declineJoinRequestFunction(joinRequest.id)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <SettingsForm />
      </CardContent>
    </Card>
  );
};
