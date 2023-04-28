import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Contact: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Privacy</title>
        <meta name="description" content="Squad Organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h3>super</h3>
    </>
  );
};

export default Contact;
