import { useState } from "react";
import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";
import CreateTeamForm from "~/components/forms/CreateTeamForm";
import PunishmentsAndContributionsTable from "~/components/lists/PunishmentsAndContributionsTable";
import TeamMembersList from "~/components/lists/TeamMembersList";

import { DeleteTeamDialog } from "~/components/forms/DeleteTeamDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { CreateOrEditPunishmentOrContributionDialog } from "./forms/CreateOrEditPunishmentDialog";

export const Team = () => {
  const { toast } = useToast();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const teamData = api.team.getTeamData.useQuery({ teamId: actualTeam });
  const [showModal, setShowModal] = useState(false);
  const [value, copy] = useCopyToClipboard();

  const getHostUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.host;
    }
    return "";
  };

  const copyToClipBoard = () => {
    copy(getHostUrl() + "/teams/join?teamId=" + actualTeam);
    toast({
      title: "Link Copied",
    });
  };
  return (
    <div className=" flex w-full flex-col items-center">
      <Card className="relative mt-4 block w-full  p-6  sm:w-full lg:w-8/12 2xl:w-6/12">
        <CardHeader>
          {actualTeam ? (
            <>
              <CardTitle> {teamData.data?.name}</CardTitle>
              <CardDescription>{teamData.data?.description}</CardDescription>
            </>
          ) : (
            <CardTitle> Create or join a team</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <div className="absolute  right-0 top-0 ">
            <CreateTeamForm edit={false} data={teamData.data}></CreateTeamForm>
            {actualTeam && (
              <>
                <CreateTeamForm
                  edit={true}
                  data={teamData.data}
                ></CreateTeamForm>
                <DeleteTeamDialog></DeleteTeamDialog>
              </>
            )}
          </div>

          <address className="font-normal text-gray-700 dark:text-gray-400">
            {teamData.data?.location}
          </address>
          <br />

          {actualTeam && (
            <>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Share this link with your team members:
              </p>
              <Input
                type="text"
                name="shareurl"
                id="share-team-url"
                readOnly={true}
                onClick={copyToClipBoard}
                value={getHostUrl() + "/teams/join?teamId=" + actualTeam}
                className="cursor-pointer"
                placeholder="Search for members"
              />
              <TeamMembersList></TeamMembersList>
            </>
          )}
        </CardContent>
      </Card>

      {actualTeam && (
        <Card className="relative mt-4 block w-full  p-6  sm:w-10/12 md:w-full lg:w-8/12 2xl:w-6/12">
          <CardHeader>
            <CardTitle> Strafenkatalog / Mannschaftsbeitraege</CardTitle>
            <CardDescription>
              Here you can see all punishments and contributions types of your
              squad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="absolute  right-0 top-0 ">
              <CreateOrEditPunishmentOrContributionDialog
                edit={false}
                data={null}
              ></CreateOrEditPunishmentOrContributionDialog>
            </div>
            <PunishmentsAndContributionsTable></PunishmentsAndContributionsTable>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
