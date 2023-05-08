import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import { useLocalStorage, useOnClickOutside } from "usehooks-ts";
import Transactions from "~/components/tabs/Transactions";
import CreateTeamForm from "~/components/forms/CreateTeamForm";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Team } from "~/components/tabs/Team";
import { SelectTeamComponent } from "~/components/SelectTeamComponent";
import { Personal } from "~/components/tabs/Personal";
import { api } from "~/utils/api";

const Dashboard: NextPage = () => {
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Squad Organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-full w-full">
        <div className="flex w-full justify-center ">
          <SelectTeamComponent />
        </div>
        <Tabs defaultValue="transactions">
          <div className="flex w-full justify-center">
            <TabsList className="grid w-full grid-cols-3 sm:w-full xl:w-10/12 2xl:w-8/12">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="team">team</TabsTrigger>
              <TabsTrigger value="personal">personal</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="transactions">
            <Transactions></Transactions>
          </TabsContent>
          <TabsContent value="team">
            <Team></Team>
          </TabsContent>

          <TabsContent value="personal">
            <Personal />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;
