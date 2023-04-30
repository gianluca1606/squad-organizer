import Link from "next/link";
import { FC, ReactNode } from "react";
import Image from "next/image";
interface Props {
  children?: ReactNode;
}

const Footer: FC = ({ children }: Props) => {
  return (
    <>
      <footer className="light:bg-white m-4 rounded-lg shadow dark:bg-background">
        <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="https://flowbite.com/"
              className="mb-4 flex items-center sm:mb-0"
            >
              <Image
                src="/logo-no-background.png"
                width={150}
                height={150}
                alt="Squad Organizer Logo"
              />
            </a>
            <ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0">
              <li>
                <Link className="mr-4 hover:underline md:mr-6" href="/about">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6 ">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
          <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
            © 2023{" "}
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
