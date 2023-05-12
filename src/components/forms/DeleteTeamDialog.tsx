import { useLocalStorage } from "@mantine/hooks";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

export const DeleteTeamDialog = () => {
  const [actualTeam, setActualTeamFunction] = useLocalStorage({
    defaultValue: "",
    key: "teamId",
  });
  const router = useRouter();
  const { toast } = useToast();
  const deleteTeam = api.team.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Team deleted",
        description: "The team has been deleted",
      });

      router.reload();
    },
    onError: (error) => {
      toast({
        title: "Error while deleting team",
        description: "Some error occured please try later again",
        variant: "destructive",
      });
    },
  });

  const deleteTeamMutation = () => {
    deleteTeam.mutate({ teamId: actualTeam });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" disabled={deleteTeam.isLoading}>
          <Trash2 className="h-5 w-5 " />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={() => deleteTeamMutation()}>Continue </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
