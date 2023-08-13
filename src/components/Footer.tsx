import Link from 'next/link';
import { FC, ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
interface Props {
    children?: ReactNode;
}

const pages = [
    {
        title: 'About',
        href: '/about',
    },
    {
        title: 'Privacy Policy',
        href: '/privacy-policy',
    },
    {
        title: 'Terms of Service',
        href: '/terms-of-service',
    },
    {
        title: 'Cookies',
        href: '/cookies',
    },
    {
        title: 'Contact',
        href: '/contact',
    },
];

const Footer: FC = ({ children }: Props) => {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    return (
        <>
            <footer className="light:bg-white m-4 rounded-lg shadow dark:bg-background">
                <div className="mx-auto w-full max-w-screen-2xl p-4 md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="https://flowbite.com/" className="mb-4 flex items-center sm:mb-0">
                            <Image
                                priority
                                src={currentTheme === 'dark' ? '/logo-no-background.png' : '/logo-black.svg'}
                                width={150}
                                height={150}
                                alt="Squad Organizer Logo"
                            />
                        </a>
                        <ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0">
                            {pages.map((page) => (
                                <li key={page.href}>
                                    <Link href={page.href} className="mr-4 cursor-pointer hover:underline md:mr-6">
                                        {page.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
                    <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
                        © 2023{' '}
                        <a href="https://flowbite.com/" className="hover:underline">
                            Squad organizer™
                        </a>
                        . All Rights Reserved.
                    </span>
                </div>
            </footer>
        </>
    );
};

export default Footer;
