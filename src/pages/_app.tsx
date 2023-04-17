import { AppProps, type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NavBar } from "~/components/NavBar";
import { ThemeProvider } from "next-themes";
import Layout from "~/components/Layout";
import { NextIntlProvider } from "next-intl";

// adjust the pageProps to have a `messages` property
// that is the result of `await serverSideTranslations(locale, ['common'])`

type PageProps = {
  messages: IntlMessages;
  now: number;
};

type Props = Omit<AppProps<PageProps>, "pageProps"> & {
  pageProps: PageProps;
};

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      <NextIntlProvider messages={pageProps.messages}>
        <ThemeProvider>
          {/* 
// @ts-ignore */}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </NextIntlProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
