import App, { AppContext, AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import { deDe, enUS } from "@clerk/localizations";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import Layout from "~/components/Layout";
import { NextIntlProvider } from "next-intl";
import { cookies } from "next/headers";
import { GetServerSidePropsContext } from "next";
// adjust the pageProps to have a `messages` property
// that is the result of `await serverSideTranslations(locale, ['common'])`
function getCookieValue(
  cookieName: string,
  ctx: AppContext
): string | undefined {
  const cookies = ctx.ctx.req?.headers.cookie!.split("; ");
  if (!cookies) return undefined;
  for (let i = 0; i < cookies.length; i++) {
    const [name, value] = cookies![i]!.split("=");
    if (name === cookieName) {
      return value!;
    }
  }
  return undefined;
}

type AppOwnProps = { locale: typeof deDe | typeof enUS };

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps} localization={pageProps.locale}>
      <NextIntlProvider messages={pageProps.messages}>
        <ThemeProvider attribute="class">
          <div id="modals" />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </NextIntlProvider>
    </ClerkProvider>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const ctx = await App.getInitialProps(context);
  let localeCookie = getCookieValue("locale", context);
  let locale;
  if (localeCookie === "de") {
    locale = deDe;
  } else {
    locale = enUS;
  }
  return {
    pageProps: {
      locale: locale,
      messages: [],
    },
  };
};

export default api.withTRPC(MyApp);
