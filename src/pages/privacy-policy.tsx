import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const Home: NextPage = () => {
    //const hello = api.example.hello.useQuery({ text: "from tRPC" });

    return (
        <>
            <Head>
                <title>About</title>
                <meta name="squadorganizer" content="Squad Organizer" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Card className="relative mt-4 block w-full  p-0 sm:w-full md:p-6 xl:w-10/12 2xl:w-8/12">
                <CardHeader>
                    <CardTitle>Privacy policy</CardTitle>
                </CardHeader>
                <CardContent>
                    <h5>Privacy Policy for Squad Organizer Effective Date: [23.05.2023]</h5>
                    <br />
                    <br />
                    <p className="mb-8 overflow-auto text-center  sm:text-xl lg:mb-16">
                        At Squad Organizer, we prioritize the privacy and security of our users. This Privacy Policy
                        outlines the types of information we collect, how we use and protect that information, and your
                        rights regarding your personal data. By using our app, Squad Organizer, you consent to the
                        practices described in this policy.
                    </p>

                    <ul className="list-inside list-decimal space-y-1 ">
                        <li>
                            Information We Collect:
                            <ul className="ml-4 list-inside list-disc space-y-1 ">
                                <li>
                                    a. User Account Information: When you sign up for an account or log in to Squad
                                    Organizer, we utilize Clerk for user management and social logins. Clerk handles the
                                    collection and management of your account information, including your name, email
                                    address, and social media profiles. Please refer to Clerk's Privacy Policy to
                                    understand how they handle your data.
                                </li>
                                <li>
                                    b. Preferred Language: We use one cookie to store your preferred language setting.
                                    This information helps us provide content in your preferred language for a
                                    personalized user experience.
                                </li>

                                <li>
                                    c. Current Non-Personal Setting: We use one local key to store a current
                                    non-personal setting, such as a display preference or theme. This information is
                                    stored locally on your device and is not associated with any personally identifiable
                                    information.
                                </li>
                            </ul>
                        </li>
                        <li>
                            Use of Information:
                            <ul className="ml-4 list-inside list-disc space-y-1 ">
                                <li>
                                    a. User Account Information: We use your user account information provided by Clerk
                                    for authentication purposes and to personalize your experience within Squad
                                    Organizer.
                                </li>
                                <li>
                                    b. Preferred Language: We use the preferred language information stored in the
                                    cookie to display content in your chosen language.
                                </li>

                                <li>
                                    c. Current Non-Personal Setting: We use the local key to maintain your current
                                    non-personal setting preferences.
                                </li>
                            </ul>
                        </li>

                        <li>
                            Data Security:
                            <ul className="ml-4 list-inside list-disc space-y-1 ">
                                <li>
                                    a. Storage: All data collected through Squad Organizer is safely stored in our
                                    secure databases. We have implemented appropriate technical and organizational
                                    measures to protect against unauthorized access, alteration, disclosure, or
                                    destruction of your personal information.
                                </li>
                                <li>
                                    b. Third-Party Services: We only use Clerk for user management and social logins. We
                                    have chosen Clerk because they prioritize data security and have robust measures in
                                    place to protect your personal information. However, please note that the security
                                    and privacy practices of third-party services are subject to their respective
                                    privacy policies, and we encourage you to review them.
                                </li>
                                <li>
                                    c. Vercel Logs: It's important to note that when accessing Squad Organizer, Vercel,
                                    the platform where our app is deployed, may automatically log certain information,
                                    including IP addresses. However, we do not actively use this data for any purpose.
                                </li>
                            </ul>
                        </li>

                        <li>
                            Data Retention:
                            <br />
                            We retain your personal data for as long as necessary to provide you with the services
                            offered by Squad Organizer or as required by law. If you wish to delete your account or
                            request the deletion of your personal data, please contact us using the information provided
                            in Section 7.
                        </li>

                        <li>
                            Children's Privacy:
                            <br />
                            Squad Organizer is intended for users who are 18 years of age or older. We do not knowingly
                            collect personal information from children under the age of 18. If you believe that we have
                            inadvertently collected personal information from a child under the age of 18, please
                            contact us immediately.
                        </li>

                        <li>
                            Changes to this Privacy Policy:
                            <br />
                            We may update this Privacy Policy from time to time to reflect changes in our practices. We
                            will notify you of any material changes by posting the updated policy on our website or
                            through other communication channels.
                        </li>

                        <li>
                            Contact Us:
                            <br />
                            If you have any questions, concerns, or requests regarding this Privacy Policy or the
                            handling of your personal information, please contact us
                            <br />
                            <Link href="contact"> Contact page</Link>.
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </>
    );
};

export default Home;
