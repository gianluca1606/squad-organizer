import { deDe, enUS } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { NextIntlProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { AppContext, AppProps, type AppType } from 'next/app';
import Layout from '~/components/Layout';
import { Toaster } from '~/components/ui/toaster';
import '~/styles/globals.css';
import { api } from '~/utils/api';
import CookieConsent, { Cookies } from 'react-cookie-consent';
import { useRouter } from 'next/router';

// adjust the pageProps to have a `messages` property
// that is the result of `await serverSideTranslations(locale, ['common'])`
function getCookieValue(cookieName: string, ctx: AppContext): string | undefined {
    const cookies = ctx.ctx.req?.headers.cookie!.split('; ');
    if (!cookies) return undefined;
    for (let i = 0; i < cookies.length; i++) {
        const [name, value] = cookies![i]!.split('=');
        if (name === cookieName) {
            return value!;
        }
    }
    return undefined;
}

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    return (
        <ClerkProvider
            {...pageProps}
            localization={pageProps.locale}
            appearance={{
                baseTheme: pageProps.theme,
            }}>
            <NextIntlProvider messages={pageProps.messages}>
                <ThemeProvider attribute="class">
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeProvider>
            </NextIntlProvider>
            <Toaster />

            <CookieConsent
                enableDeclineButton
                declineButtonStyle={{
                    background: 'red',
                    color: 'white',
                    fontWeight: 'bolder',
                    textShadow: '2px 2px black',
                }}
                declineButtonText="Decline"
                onAccept={(acceptedByScrolling) => {
                    if (acceptedByScrolling) {
                        // triggered if user scrolls past threshold
                        router.reload();
                    } else {
                        router.reload();
                    }
                }}>
                We use cookies to provide you with a better browsing experience, analyze site traffic, and personalize
                content. We also use third-party services such as Google Analytics to understand how you use our site
                and to improve our services. By clicking "Allow all cookies", you consent to the use of cookies and the
                processing of your personal data for these purposes. You may visit our Cookie Prefences page to learn
                more about the types of cookies we use and how to manage your preferences.
            </CookieConsent>
        </ClerkProvider>
    );
};

MyApp.getInitialProps = async (context: AppContext) => {
    let localeCookie = getCookieValue('locale', context);
    let themeCookie = getCookieValue('theme', context);

    let locale;
    let theme;

    if (getCookieValue('CookieConsent', context) === 'true') {
        if (localeCookie === 'de') {
            locale = deDe;
        } else {
            locale = enUS;
        }
        if (themeCookie === 'light') {
            theme = null;
        } else {
            theme = dark;
        }
    }

    return {
        pageProps: {
            locale: locale,
            theme: theme ?? 'light',
            messages: [],
        },
    };
};

export default api.withTRPC(MyApp);
