import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "components/ui/button";
import { Edit, Loader2, Plus } from "lucide-react";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";
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
import { CreateEditTeamProps } from "~/interfaces/CreateEditTeamProps";
import { RouterInputs, api } from "~/utils/api";

type CreateTeamInput = RouterInputs["team"]["create"];

const CreateTeamForm: FC<CreateEditTeamProps> = ({ edit, data }) => {
  const createTeam = api.team.create.useMutation();
  const editTeam = api.team.update.useMutation();
  const getTeamById = api.team.getTeamData.useQuery({ teamId: data?.id });
  const loadTeams = api.team.getTeamsForLoggedInUser.useQuery();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");

  const { register, handleSubmit, setValue } = useForm<CreateTeamInput>();

  useEffect(() => {
    if (edit && data) {
      setValue("name", data!.name);
      setValue("description", data?.description ? data?.description : "");
      setValue("location", data?.location ? data?.location : "");
    }
  }, [data]);

  const onSubmit = (formData: CreateTeamInput) => {
    if (edit) {
      editTeam.mutateAsync({ ...formData, teamId: data!.id }).then((result) => {
        getTeamById.refetch();
        setActualTeamFunction(result.id);
        loadTeams.refetch();
        //closeModal();
      });
    } else {
      createTeam.mutateAsync(formData).then((result) => {
        setActualTeamFunction(result.id);
        loadTeams.refetch();
        //closeModal();
      });
    }
  };

  const save = () => {
    handleSubmit(onSubmit)();
  };
  //@ts-ignore
  //const t: any = useTranslations("Settings");

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">
            {edit ? (
              <Edit className="h-5 w-5 " />
            ) : (
              <Plus className="h-5 w-5 " />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> {edit ? "Edit team" : "Create team"}</DialogTitle>
            <DialogDescription>Create a team and organize it</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-1/2">
            <div className="mb-6">
              <Label htmlFor="teamname">Team Name</Label>
              <Input
                type="teamname"
                id="teamname"
                placeholder="Email"
                required
                {...register("name", { required: true })}
              />

              <Label htmlFor="teamname">Location</Label>
              <Input
                type="location"
                id="location"
                placeholder="Location"
                required
                {...register("location", { required: true })}
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
            </div>
          </form>
          <DialogFooter>
            <DialogClose>
              <Button
                variant={"outline"}
                disabled={editTeam.isLoading || createTeam.isLoading}
                onClick={save}
              >
                {editTeam.isLoading || createTeam.isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTeamForm;
