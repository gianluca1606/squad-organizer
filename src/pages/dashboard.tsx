import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import { useLocalStorage, useOnClickOutside } from "usehooks-ts";
import Transactions from "~/components/Transactions";
import CreateTeamForm from "~/components/forms/CreateTeamForm";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Team } from "~/components/Team";
import { SelectTeamComponent } from "~/components/SelectTeamComponent";

const Dashboard: NextPage = () => {
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
            <TabsList className="grid w-full grid-cols-2 sm:w-full lg:w-8/12 2xl:w-6/12">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="team">team</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="transactions">
            <Transactions></Transactions>
          </TabsContent>
          <TabsContent value="team">
            <Team></Team>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;
