import { buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server";
import { pick } from "lodash";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  type NextPage,
} from "next";
import Head from "next/head";
import SettingsForm from "~/components/forms/SettingsForm";

export type NextPageWithAuth<P = {}, IP = P> = NextPage<P, IP> & {
  messages: string[];
};

const Settings: NextPageWithAuth = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <Head>
        <title>Squad Organizer - Account Settings</title>
        <meta name="description" content="Squad Organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SettingsForm />
    </>
  );
};

Settings.messages = ["Settings"];
export default Settings;

export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
  const { userId } = getAuth(req);

  const user = userId ? await clerkClient.users.getUser(userId) : undefined;
  // return { props: { ...buildClerkProps(ctx.req, { user }) } };
  return {
    props: {
      // You can get the messages from anywhere you like. The recommended pattern
      // is to put them in JSON files separated by locale (e.g. `en.json`).
      messages: pick(
        await import(`../messages/${req.cookies.locale}.json`),
        Settings.messages
      ),
      revalidate: 1,
    },
  };
}
