import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

import { api } from '~/utils/api';

const Home: NextPage = () => {
    //const hello = api.example.hello.useQuery({ text: "from tRPC" });

    return (
        <>
            <Head>
                <title>Privacy</title>
                <meta name="description" content="Squad Organizer" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Card>
                <CardHeader>
                    <CardTitle>Terms of Service</CardTitle>
                </CardHeader>
                <CardContent>
                    Terms of Service for Squad Organizer Effective Date: [Date] Please read these Terms of Service
                    ("Terms") carefully before using Squad Organizer ("the App"). By using the App, you agree to be
                    bound by these Terms. If you do not agree with any part of these Terms, you may not use the App. 1.
                    Account Registration: a. To use the App, you may be required to create an account. You agree to
                    provide accurate and complete information during the registration process. You are solely
                    responsible for maintaining the confidentiality of your account credentials and for all activities
                    that occur under your account. 2. Use of the App: a. You may use the App for your personal,
                    non-commercial purposes only. You may not use the App for any illegal or unauthorized purpose. You
                    agree to comply with all applicable laws and regulations while using the App. b. You acknowledge
                    that the App uses a cookie to store your preferred language setting. This cookie is essential for
                    providing content in your preferred language and cannot be disabled. c. The App utilizes Clerk for
                    user management and social logins. Clerk may use cookies for session management, which are essential
                    for the functioning of the App. By using the App, you consent to the use of these cookies by Clerk.
                    3. Intellectual Property: a. The App and its contents, including but not limited to text, graphics,
                    images, logos, and software, are the intellectual property of Squad Organizer and its licensors. You
                    may not copy, modify, distribute, transmit, display, perform, reproduce, or publish any part of the
                    App without prior written consent from Squad Organizer. 4. Limitation of Liability: a. The App is
                    provided on an "as is" and "as available" basis. Squad Organizer makes no warranties or
                    representations, either express or implied, regarding the App, its availability, or its fitness for
                    a particular purpose. b. Squad Organizer shall not be liable for any indirect, incidental, special,
                    consequential, or punitive damages arising out of or related to your use of the App, even if advised
                    of the possibility of such damages. 5. Indemnification: a. You agree to indemnify, defend, and hold
                    harmless Squad Organizer, its officers, directors, employees, and agents from any and all claims,
                    liabilities, damages, losses, or expenses, including reasonable attorneys' fees and costs, arising
                    out of or in any way connected with your use of the App or violation of these Terms. 6. Modification
                    and Termination: a. Squad Organizer reserves the right to modify, suspend, or terminate the App, or
                    any part thereof, at any time and without prior notice. b. Squad Organizer may also modify these
                    Terms at any time. The updated Terms will be effective upon posting on the App. Your continued use
                    of the App after any modifications to the Terms constitutes your acceptance of the updated Terms. 7.
                    Governing Law: a. These Terms shall be governed by and construed in accordance with the laws of
                    [Jurisdiction]. Any disputes arising out of or relating to these Terms shall be subject to the
                    exclusive jurisdiction of the courts located in [Jurisdiction]. 8. Contact Us: If you have any
                    questions, concerns, or inquiries regarding these Terms or the use of the App, please contact us at
                    [contact information]. Please note that these Terms of Service govern your use of Squad Organizer
                    and may not address specific legal requirements for your jurisdiction. It is your responsibility to
                    comply with applicable laws and regulations while using the App.
                </CardContent>
            </Card>
        </>
    );
};

export default Home;
