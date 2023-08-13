import { type NextPage } from 'next';
import Head from 'next/head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Contact: NextPage = () => {
    return (
        <>
            <Head>
                <title>Contact me</title>
                <meta name="description" content="Squad Organizer" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Card className="relative mt-4 block w-full  p-0 sm:w-full md:p-6 xl:w-10/12 2xl:w-8/12">
                <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-8 overflow-auto text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
                        Got a technical issue? Want to send feedback about a beta feature? Need details about our
                        Business plan? Let us know. write me an email at
                        <a href="mailto:gianlucalatina@gmail.com"> gianlucalatina@gmail.com</a>
                    </p>
                </CardContent>
            </Card>
        </>
    );
};

export default Contact;

{
    /* <Card>
<CardContent>
    <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2 className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Contact Us
        </h2>
        <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
            Got a technical issue? Want to send feedback about a beta feature? Need details about our
            Business plan? Let us know.
        </p>
        <form action="#" className="space-y-8">
            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Your email
                </label>
                <input
                    type="email"
                    id="email"
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="name@flowbite.com"
                    required
                />
            </div>
            <div>
                <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                    Subject
                </label>
                <input
                    type="text"
                    id="subject"
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Let us know how we can help you"
                    required
                />
            </div>
            <div className="sm:col-span-2">
                <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400">
                    Your message
                </label>
                <textarea
                    id="message"
                    rows={6}
                    className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Leave a comment..."
                    defaultValue={''}
                />
            </div>
            <button
                type="submit"
                className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-lg px-5 py-3 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 sm:w-fit">
                Send message
            </button>
        </form>
    </div>
</CardContent>
</Card> */
}
