import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import { useLocalStorage, useOnClickOutside } from "usehooks-ts";
import CreateTeamForm from "~/components/forms/CreateTeamForm";
import PunishmentsAndContributionsTable from "~/components/lists/PunishmentsAndContributionsTable";
import TeamMembersList from "~/components/lists/TeamMembersList";
import DialogLayout from "~/components/dialogs/DialogLayout";

import { api } from "~/utils/api";
import { WarnButton } from "~/components/controls/WarnButton";

const TeamsPage: NextPage = () => {
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const teamData = api.team.getTeamData.useQuery({ teamId: actualTeam });
  const deleteTeam = api.team.delete.useMutation();
  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = () => {
    setShowModal(false);
  };
  useOnClickOutside(ref, handleClickOutside);
  const closeCreateEditTeamModal = () => {
    setShowModal(false);
  };

  const openCreateTeamModal = () => {
    setShowModal(true);
  };

  const openEditTeamModal = () => {
    setShowModal(true);
  };
  const deleteTeamMutation = () => {
    deleteTeam.mutate({ teamId: actualTeam });
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
            <button
              type="submit"
              onClick={openCreateTeamModal}
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              Create team
            </button>
            <button
              type="submit"
              onClick={openEditTeamModal}
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              Edit team
            </button>
            <WarnButton
              text="Delete team"
              onClick={() => deleteTeamMutation()}
            ></WarnButton>
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

          <TeamMembersList></TeamMembersList>
        </div>

        <div className="mt-4 block w-full rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800 sm:w-10/12 md:w-8/12 2xl:w-6/12">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Strafenkatalog / Mannschaftsbeitraege
          </h5>
          <PunishmentsAndContributionsTable></PunishmentsAndContributionsTable>
        </div>
      </div>

      {showModal ? (
        <>
          <DialogLayout innerRef={ref}>
            <CreateTeamForm
              data={teamData.data}
              closeModal={closeCreateEditTeamModal}
            ></CreateTeamForm>
          </DialogLayout>
        </>
      ) : null}
    </>
  );
};

export default TeamsPage;
