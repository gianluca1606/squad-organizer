import { Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { FC } from "react";
import { useLocalStorage } from "usehooks-ts";
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
type Props = {
  punishmentOrContributionId: string;
};
export const DeleteContributionOrPunishmentType: FC<Props> = ({
  punishmentOrContributionId,
}) => {
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const punishmentsAndContributionList =
    api.team.getAllContributionsAndPunishmentsForTeam.useQuery({
      teamId: actualTeam,
    });
  const { toast } = useToast();
  const deleteContributionOrPunishmentType =
    api.punishmentOrContributionType.delete.useMutation({
      onSuccess: () => {
        toast({
          title: "Punishment/Contribution deleted",
        });
        punishmentsAndContributionList.refetch();
      },
      onError: (error) => {
        toast({
          title: "Error while deleting Punishment/Contribution",
          description: "Some error occured please try later again",
          variant: "destructive",
        });
      },
    });

  const deletePunishmentOrContributionTypeMutation = () => {
    deleteContributionOrPunishmentType.mutate({
      punishmentOrContributionId: punishmentOrContributionId,
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          disabled={deleteContributionOrPunishmentType.isLoading}
        >
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
            <Button
              onClick={() => deletePunishmentOrContributionTypeMutation()}
            >
              Continue{" "}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
