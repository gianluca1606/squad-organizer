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

export const DeleteBalanceEntryDialog = ({
  teamBalanceEntryId,
  refetchBalanceEntries,
}: {
  teamBalanceEntryId: string;
  refetchBalanceEntries: () => void;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const deleteBalanceEntry = api.teamBalance.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Balance entry deleted",
      });
      refetchBalanceEntries();
    },
    onError: (error) => {
      toast({
        title: "Error while deleting team",
        description: "Some error occured please try later again",
        variant: "destructive",
      });
    },
  });

  const deleteBalanceEntryMutation = () => {
    deleteBalanceEntry.mutate({ teamBalanceEntryId: teamBalanceEntryId });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" disabled={deleteBalanceEntry.isLoading}>
          <Trash2 className="h-4 w-4 " />
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
            <Button onClick={() => deleteBalanceEntryMutation()}>
              Continue{" "}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
