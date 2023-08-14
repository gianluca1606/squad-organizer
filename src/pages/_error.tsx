import { type NextPage } from 'next';
import Image from 'next/image';

const InternalServerErrorPage: NextPage = () => {
    return (
        <main className="bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 dark:bg-gray-900 xl:px-0">
                <div className="block md:max-w-lg">
                    <Image
                        src="https://flowbite-admin-dashboard.vercel.app/images/illustrations/500.svg"
                        alt="astronaut image"
                    />
                </div>
                <div className="text-center xl:max-w-4xl">
                    <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                        Something has gone seriously wrong
                    </h1>
                    <p className="mb-5 text-base font-normal text-gray-500 dark:text-gray-400 md:text-lg">
                        It&apos;s always time for a coffee break. We should be back by the time you finish your coffee.
                    </p>
                    <a
                        href="https://flowbite-admin-dashboard.vercel.app/"
                        className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mr-3 inline-flex items-center rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4">
                        <svg
                            className="-ml-1 mr-2 h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Go back home
                    </a>
                </div>
            </div>
        </main>
    );
};

export default InternalServerErrorPage;
