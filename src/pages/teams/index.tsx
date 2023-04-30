import { type NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import {
  useCopyToClipboard,
  useLocalStorage,
  useOnClickOutside,
} from "usehooks-ts";
import CreateTeamForm from "~/components/forms/CreateTeamForm";
import PunishmentsAndContributionsTable from "~/components/lists/PunishmentsAndContributionsTable";
import TeamMembersList from "~/components/lists/TeamMembersList";

import { api } from "~/utils/api";
import { Button } from "components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
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

const TeamsPage: NextPage = () => {
  const [edit, setEdit] = useState(false);
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const teamData = api.team.getTeamData.useQuery({ teamId: actualTeam });
  const deleteTeam = api.team.delete.useMutation();
  const [showModal, setShowModal] = useState(false);
  const [value, copy] = useCopyToClipboard();

  const closeCreateEditTeamModal = () => {
    setEdit(false);
    setShowModal(false);
  };

  const openCreateTeamModal = () => {
    setEdit(false);
    setShowModal(true);
  };

  const openOrCloseEditTeamModal = () => {
    setEdit(!edit);
    setShowModal(!showModal);
  };
  const deleteTeamMutation = () => {
    deleteTeam.mutate({ teamId: actualTeam });
  };

  const getHostUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  return (
    <>
      <Head>
        <title>Team View</title>
        <meta name="description" content="Squad Organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className=" flex w-full flex-col items-center">
        <div className="relative block w-full rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800 sm:w-10/12 md:w-8/12 2xl:w-6/12 ">
          <div className="absolute  right-0 top-0 ">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Create team</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <CreateTeamForm
                  edit={edit}
                  data={teamData.data}
                  closeModal={closeCreateEditTeamModal}
                ></CreateTeamForm>
              </DialogContent>
            </Dialog>

            <Dialog open={showModal} onOpenChange={openOrCloseEditTeamModal}>
              <DialogTrigger asChild>
                <Button variant="secondary" onClick={openOrCloseEditTeamModal}>
                  Edit team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <CreateTeamForm
                  edit={true}
                  data={teamData.data}
                  closeModal={closeCreateEditTeamModal}
                ></CreateTeamForm>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleteTeam.isLoading}>
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button onClick={() => deleteTeamMutation()}>
                      Continue{" "}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {teamData.data?.name}
          </h5>
          <address className="font-normal text-gray-700 dark:text-gray-400">
            {teamData.data?.location}
          </address>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {teamData.data?.description}
          </p>

          <p className="font-normal text-gray-700 dark:text-gray-400">
            Share this link with your team members:
          </p>

          <input
            //disabled={true}
            type="text"
            name="shareurl"
            id="share-team-url"
            readOnly={true}
            onClick={() => copy(getHostUrl() + "/join?teamId=" + actualTeam)}
            value={getHostUrl() + "/join?teamId=" + actualTeam}
            className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 mt-4 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
            placeholder="Search for members"
          />

          <TeamMembersList></TeamMembersList>
        </div>

        <div className="relative mt-4 block w-full rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800 sm:w-10/12 md:w-8/12 2xl:w-6/12">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Strafenkatalog / Mannschaftsbeitraege
          </h5>
          <div className="absolute  right-0 top-0 ">
            <Dialog>
              <DialogTrigger>
                <Button asChild variant="default">
                  Create strafe
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <PunishmentsAndContributionsTable></PunishmentsAndContributionsTable>
        </div>
      </div>
    </>
  );
};

export default TeamsPage;
