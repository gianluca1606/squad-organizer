import { type NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const Cookies: NextPage = () => {
    const [defaultValue, setDefaultValue] = useState('option-two');
    const [consentCookieVal, setConsentCookieVal, removeConsentCookieVal] = useCookies(['CookieConsent']);

    useEffect(
        () => setDefaultValue(consentCookieVal.CookieConsent === 'true' ? 'option-one' : 'option-two'),
        [consentCookieVal]
    );

    const getDefaultValue = () => {
        console.log('getDefaultValue', defaultValue);
        return defaultValue;
    };

    const onValueChange = (value: string) => {
        console.log('onValueChange', value);
    };

    const setConsent = (value: string) => {
        if (value === 'option-one') {
            setDefaultValue('option-one');
            setConsentCookieVal('CookieConsent', 'true', { path: '/' });
        } else {
            setDefaultValue('option-two');
            setConsentCookieVal('CookieConsent', 'false', { path: '/' });
        }
    };
    return (
        <>
            <Head>
                <title>Cookies Preferences</title>
                <meta name="description" content="Squad Organizer" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Card className="relative mt-4 block w-full  p-0 sm:w-full md:p-6 xl:w-10/12 2xl:w-8/12">
                <CardHeader>
                    <CardTitle>Cookies Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-8 overflow-auto text-center font-light  sm:text-xl lg:mb-16">
                        Welcome to our app! This page explains our use of cookies and allows you to customize your
                        cookie preferences. Please read this information carefully before proceeding to use the app. By
                        accepting our cookie policy, you agree to the use of cookies as described below.
                    </p>

                    <p className="mb-8 overflow-auto text-center font-light  sm:text-xl lg:mb-16">
                        What are cookies? Cookies are small text files that are placed on your device when you visit a
                        website or use an application. They are widely used to improve user experience, provide relevant
                        content, and gather statistical information about user interactions. Cookies may be stored on
                        your device by the app or by third-party services that we use.
                    </p>
                    <p className="mb-8 overflow-auto text-center font-light  sm:text-xl lg:mb-16">
                        Why do we use cookies? We use cookies to enhance your experience and make our app more efficient
                        and user-friendly. Cookies enable us to remember your preferences, analyze usage patterns, and
                        personalize content and advertisements. They also help us understand how you interact with our
                        app and enable certain features to function properly.
                    </p>
                    <p className="mb-8 overflow-auto text-center  sm:text-xl lg:mb-16">Types of cookies we use:</p>
                    <ol className="list-decimal">
                        <li>
                            Essential Cookies: These cookies are necessary for the app to function properly. They enable
                            core functionality, such as remembering your login details and maintaining session
                            information. Without these cookies, the app may not work as intended.
                        </li>
                        <li>
                            Analytical Cookies: These cookies help us understand how users interact with our app by
                            collecting anonymous information. We use this data to analyze app usage patterns, identify
                            areas for improvement, and enhance user experience.
                        </li>
                        <li>
                            Advertising Cookies: We may partner with third-party advertisers who use cookies to deliver
                            relevant advertisements based on your interests. These cookies collect data about your
                            online activities, such as the pages you visit, the links you click, and your interaction
                            with advertisements. The information collected is used to display personalized ads and
                            measure their effectiveness.
                        </li>
                    </ol>

                    <p className="mb-8 overflow-auto text-center font-light  sm:text-xl lg:mb-16">
                        Managing Your Cookie Preferences: To use this app, you must accept the use of cookies. If you do
                        not wish to accept cookies, you will not be able to use the app. By accepting our cookie policy,
                        you agree to our use of cookies as outlined above.
                    </p>

                    <p className="mb-8 overflow-auto text-center font-light  sm:text-xl lg:mb-16">
                        You can modify your cookie preferences at any time by accessing the "Cookie Settings" option
                        within the app's settings menu. Please note that if you disable certain cookies, it may affect
                        your app experience and limit the availability of certain features.
                    </p>
                    <p className="mb-8 overflow-auto text-center font-light  sm:text-xl lg:mb-16">
                        By using our app, you acknowledge that you have read and understood this cookie policy. If you
                        have any questions or concerns about our use of cookies, please contact us through the provided
                        channels.
                    </p>
                    <p className="mb-8 overflow-auto text-center font-light  sm:text-xl lg:mb-16">
                        Note: We are not responsible for any unauthorized attempts to bypass or disable the cookie
                        consent mechanism. It is your responsibility to ensure that you have accepted the cookie policy
                        to use our app.
                    </p>

                    <p>Thank you for your understanding and cooperation. Enjoy using our app!</p>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cookie Settings</CardTitle>
                            <CardDescription>Manage your cookie settings here.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="necessary" className="flex flex-col space-y-1">
                                    <span>Strictly Necessary</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        These cookies are essential in order to use the website and use its features.
                                    </span>
                                </Label>
                                <Switch id="necessary" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="functional" className="flex flex-col space-y-1">
                                    <span>Functional Cookies</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        These cookies allow the website to provide personalized functionality.
                                    </span>
                                </Label>
                                <Switch id="functional" />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="performance" className="flex flex-col space-y-1">
                                    <span>Performance Cookies</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        These cookies help to improve the performance of the website.
                                    </span>
                                </Label>
                                <Switch id="performance" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">
                                Save preferences
                            </Button>
                        </CardFooter>
                    </Card>
                    <div>
                        <RadioGroup
                            defaultValue={getDefaultValue()}
                            onValueChange={(value) => {
                                onValueChange(value);
                            }}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="option-one"
                                    id="option-one"
                                    onClick={() => {
                                        setConsent('option-one');
                                    }}
                                />
                                <Label htmlFor="option-one">Accept all</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="option-two"
                                    id="option-two"
                                    onClick={() => {
                                        setConsent('option-two');
                                    }}
                                />
                                <Label htmlFor="option-two">Reject all</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default Cookies;
