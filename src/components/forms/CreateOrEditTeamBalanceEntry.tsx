import { DialogClose } from "@radix-ui/react-dialog";
import { Edit, Loader2, Plus } from "lucide-react";
import { FC, useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";
import { RouterInputs, api } from "~/utils/api";
import { getNameOrMail } from "~/utils/getNameOrMail";

type CreateOrUpDateTeamBalanceEntry = RouterInputs["teamBalance"]["create"];
type CreateEditBalanceProps = {
  edit: boolean;
  data?: CreateOrUpDateTeamBalanceEntry | null;
};
export const CreateOrEditTeamBalanceEntry: FC<CreateEditBalanceProps> = ({
  edit,
  data,
}) => {
  const { toast } = useToast();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const teamMembers = api.team.getMembers.useQuery({
    teamId: actualTeam,
  });
  const { register, handleSubmit, setValue, reset, getValues, watch } =
    useForm<CreateOrUpDateTeamBalanceEntry>();

  const allMembers = api.team.getMembers.useQuery(
    {
      teamId: actualTeam,
    },
    {
      onSuccess: (data) => {
        if (!edit) {
          setValue("clerkId", data[0]!.id);
        }
      },
    }
  );

  const punishmentsAndContributionList =
    api.team.getAllContributionsAndPunishmentsForTeam.useQuery(
      {
        teamId: actualTeam,
      },
      {
        onSuccess: (data) => {
          if (!edit) {
            setValue("name", data.punishmentsOrContributions[0]!.name);
          }
        },
      }
    );

  const createBalanceEntry =
    api.punishmentOrContributionType.create.useMutation({
      onSuccess: (data) => {
        toast({
          title: "Balance Entry created",
        });
        reset();
        punishmentsAndContributionList.refetch();
      },
    });
  const editBalanceEntry = api.punishmentOrContributionType.update.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Balance Entry updated",
      });
      reset();
      punishmentsAndContributionList.refetch();
    },
  });

  const save = () => {
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (!edit) {
      setValue("teamId", actualTeam);
      setValue("type", "punishmentOrContribution");
      setValue(
        "name",
        punishmentsAndContributionList.data?.punishmentsOrContributions[0]!
          .name!
      );
    }
    if (edit && data) {
      setValue("name", data!.name);
      setValue("description", data?.description ? data?.description : "");
      setValue("price", data?.price ? data?.price : 0);
      setValue("teamId", data?.teamId ? data?.teamId : "");
    }
  }, [data]);

  const getDefaultMember = () => {
    if (!edit) {
      return allMembers.data?.[0]!.id!;
    } else {
      return data?.clerkId;
    }
  };

  const setMemberName = (memberId: string) => {
    setValue("clerkId", memberId);
  };

  const setEntryType = (entryType: string) => {
    setValue("type", entryType);
  };
  const setPunishmentOrContributionName = (name: string) => {
    setValue("name", name);
  };

  const onSubmit = (formData: CreateOrUpDateTeamBalanceEntry) => {
    // if (edit) {
    //   editPunishmmentOrContributionType.mutate({
    //     ...formData,
    //     punishmentOrContributionId: data!.id,
    //   });
    // } else {
    //   createPunishmmentOrContributionType.mutate(formData);
    // }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
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
          <Label htmlFor="teamname">Entry type</Label>
          <Select
            required
            value={getValues("type")}
            onValueChange={setEntryType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an entry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="punishmentOrContribution">
                Punishment or Contribution
              </SelectItem>
              <SelectItem value="sponsor">Sponsor</SelectItem>
            </SelectContent>
          </Select>
          {watch("type") === "punishmentOrContribution" && (
            <>
              <Label htmlFor="teamname">Member</Label>
              <Select
                value={getValues("clerkId")}
                onValueChange={setMemberName}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {allMembers.data?.map((member) => (
                    <SelectItem value={member.id} key={member.id}>
                      {getNameOrMail(member)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <Label htmlFor="teamname">Punishment or Contribution Type</Label>
          <Select
            value={getValues("name")}
            onValueChange={setPunishmentOrContributionName}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {punishmentsAndContributionList.data?.punishmentsOrContributions.map(
                (punishmentOrContribution) => (
                  <SelectItem
                    value={punishmentOrContribution.name}
                    key={punishmentOrContribution.id}
                  >
                    {punishmentOrContribution.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          <div className="mb-6">
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
          <DialogClose asChild>
            <Button
              variant={"outline"}
              disabled={
                createBalanceEntry.isLoading || editBalanceEntry.isLoading
              }
              onClick={save}
            >
              {createBalanceEntry.isLoading || editBalanceEntry.isLoading ? (
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
