import { GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import Transactions from "~/components/tabs/Transactions";

import { SelectTeamComponent } from "~/components/SelectTeamComponent";
import { Personal } from "~/components/tabs/Personal";
import { Team } from "~/components/tabs/Team";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { pick } from "lodash";

export type NextPageWithMessages<P = {}, IP = P> = NextPage<P, IP> & {
  messages: string[];
};

const Dashboard: NextPageWithMessages = () => {
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

Dashboard.messages = ["Settings", "Team"];
export default Dashboard;

export async function getServerSideProps(props: GetServerSidePropsContext) {
  return {
    props: {
      // You can get the messages from anywhere you like. The recommended pattern
      // is to put them in JSON files separated by locale (e.g. `en.json`).
      messages: pick(
        await import(`../../messages/${props.req.cookies.locale}.json`),
        Dashboard.messages
      ),
      revalidate: 1,
    },
  };
}
