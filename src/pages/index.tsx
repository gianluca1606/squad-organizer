import { GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import pick from "lodash/pick";

import { api } from "~/utils/api";
import { useTranslations } from "next-intl";

export type NextPageWithAuth<P = {}, IP = P> = NextPage<P, IP> & {
  messages: string[];
};

const Home: NextPageWithAuth = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  //@ts-ignore
  const t: any = useTranslations("Home");

  return (
    <>
      <Head>
        <title>Squad organizer</title>
        <meta name="description" content="Squad Organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h3>{t("title")}</h3>
    </>
  );
};

Home.messages = ["Home"];
export default Home;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      // You can get the messages from anywhere you like. The recommended pattern
      // is to put them in JSON files separated by locale (e.g. `en.json`).
      messages: pick(
        await import(`../messages/${locale}.json`),
        //@ts-ignore
        Home.messages
      ),
    },
  };
}
