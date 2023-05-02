import { DialogClose } from "@radix-ui/react-dialog";
import { Edit, Loader2, Plus } from "lucide-react";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { CreateEditPusnihmentOrContributionTypeProps } from "~/interfaces/CreateEditPunishmentOrContributionTypeProps";
import { RouterInputs, api } from "~/utils/api";

type CreatePusnihmentOrContributionTypeInput =
  RouterInputs["punishmentOrContributionType"]["create"];
export const CreateOrEditTeamBalanceEntry: FC<
  CreateEditPusnihmentOrContributionTypeProps
> = ({ edit, data }) => {
  const { toast } = useToast();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const punishmentsAndContributionList =
    api.team.getAllContributionsAndPunishmentsForTeam.useQuery({
      teamId: actualTeam,
    });
  const createPunishmmentOrContributionType =
    api.punishmentOrContributionType.create.useMutation({
      onSuccess: (data) => {
        toast({
          title: "Punishment or Contribution created",
        });
        reset();
        punishmentsAndContributionList.refetch();
      },
    });
  const editPunishmmentOrContributionType =
    api.punishmentOrContributionType.update.useMutation({
      onSuccess: (data) => {
        reset();
        punishmentsAndContributionList.refetch();
      },
    });

  const { register, handleSubmit, setValue, reset } =
    useForm<CreatePusnihmentOrContributionTypeInput>();

  const save = () => {
    setValue("teamId", actualTeam);
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (edit && data) {
      setValue("name", data!.name);
      setValue("description", data?.description ? data?.description : "");
      setValue("price", data?.price ? data?.price : 0);
    }
  }, [data]);

  const onSubmit = (formData: CreatePusnihmentOrContributionTypeInput) => {
    if (edit) {
      editPunishmmentOrContributionType.mutate({
        ...formData,
        punishmentOrContributionId: data!.id,
      });
    } else {
      createPunishmmentOrContributionType.mutate(formData);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button asChild variant="ghost">
          {edit ? <Edit className="h-4 w-4" /> : <Plus className="h-5 w-5 " />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Balance entry</DialogTitle>
          <DialogDescription>
            Create a new balance entry for your squad
          </DialogDescription>
        </DialogHeader>
        <form className="w-full">
          <div className="mb-6">
            <Label htmlFor="teamname">Punishment or Contribution Type</Label>
            <Input
              type="text"
              id="punishmentName"
              placeholder="Punishment name"
              required
              {...register("name", { required: true })}
            />

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Your description
              </label>
              <Textarea
                id="message"
                placeholder="Write your thoughts here.."
                {...register("description", { required: true })}
                rows={4}
              />
            </div>

            <Label htmlFor="teamname">Price</Label>
            <Input
              type="number"
              id="price"
              placeholder="price"
              required
              {...register("price", { required: true, valueAsNumber: true })}
            />
          </div>
        </form>

        <DialogFooter>
          <DialogClose>
            <Button
              variant={"outline"}
              disabled={
                createPunishmmentOrContributionType.isLoading ||
                editPunishmmentOrContributionType.isLoading
              }
              onClick={save}
            >
              {createPunishmmentOrContributionType.isLoading ||
              editPunishmmentOrContributionType.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
