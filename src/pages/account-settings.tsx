import { buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server";
import { pick } from "lodash";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  type NextPage,
} from "next";
import Head from "next/head";
import SettingsForm from "~/components/forms/SettingsForm";
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
      <div className="relative mt-4 block w-full rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800 sm:w-10/12 md:w-8/12 2xl:w-6/12">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Settings
        </h5>

        <SettingsForm />
      </div>
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
