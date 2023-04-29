import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import Transactions from "~/components/Transactions";
import CreateTeamForm from "~/components/forms/CreateTeamForm";
import DialogLayout from "~/components/dialogs/DialogLayout";

import { api } from "~/utils/api";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Squad Organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-full w-full">
        <Transactions></Transactions>
      </div>
    </>
  );
};

export default Dashboard;
