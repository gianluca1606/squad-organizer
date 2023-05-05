import { deDe, enUS } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { NextIntlProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { AppContext, AppProps, type AppType } from "next/app";
import Layout from "~/components/Layout";
import { Toaster } from "~/components/ui/toaster";
import "~/styles/globals.css";
import { api } from "~/utils/api";
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

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider
      {...pageProps}
      localization={pageProps.locale}
      appearance={{
        baseTheme: pageProps.theme,
      }}
    >
      <NextIntlProvider messages={pageProps.messages}>
        <ThemeProvider attribute="class">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </NextIntlProvider>
      <Toaster />
    </ClerkProvider>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  let localeCookie = getCookieValue("locale", context);
  let locale;
  if (localeCookie === "de") {
    locale = deDe;
  } else {
    locale = enUS;
  }

  let themeCookie = getCookieValue("theme", context);
  let theme;
  if (themeCookie === "light") {
    theme = null;
  } else {
    theme = dark;
  }
  return {
    pageProps: {
      locale: locale,
      theme: theme,
      messages: [],
    },
  };
};

export default api.withTRPC(MyApp);
