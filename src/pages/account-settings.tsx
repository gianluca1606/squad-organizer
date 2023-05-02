import { buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server";
import { pick } from "lodash";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  type NextPage,
} from "next";
import Head from "next/head";
import SettingsForm from "~/components/forms/SettingsForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import cookieUtil from "~/utils/cookies-util";

export type NextPageWithAuth<P = {}, IP = P> = NextPage<P, IP> & {
  messages: string[];
};

const Settings: NextPageWithAuth = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Squad Organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card className="relative mt-4 block w-full p-6  sm:w-10/12 md:w-full lg:w-8/12 2xl:w-6/12">
        <CardHeader>
          <CardTitle> Settings</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </>
  );
};

Settings.messages = ["Settings"];
export default Settings;

export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
  req.cookies.locale;
  return {
    props: {
      // You can get the messages from anywhere you like. The recommended pattern
      // is to put them in JSON files separated by locale (e.g. `en.json`).
      messages: pick(
        await import(
          `../messages/${cookieUtil.getLocaleCookieValue(req.cookies)}.json`
        ),
        Settings.messages
      ),
      revalidate: 1,
    },
  };
}
