"use client";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function NavBar() {
  const [mounted, setMounted] = useState(false);
  const user = useUser();
  const { systemTheme, theme, setTheme } = useTheme();
  const [hamburgerToggler, setHamburgerToggle] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleHamburger = () => {
    setHamburgerToggle(!hamburgerToggler);
  };
  return (
    <nav className="light:bg-white border-gray-200  dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            Squad Organizer
          </span>
        </Link>
        <button
          onClick={toggleHamburger}
          data-collapse-toggle="navbar-default"
          type="button"
          className="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div
          className={
            hamburgerToggler ? "hidden" : "" + " w-full md:block md:w-auto"
          }
          id="navbar-default"
        >
          <ul className="light:md:bg-white light:bg-gray-50 mt-4 flex flex-col rounded-lg border border-gray-100 p-4 font-medium dark:border-gray-700 dark:bg-gray-800  md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 md:dark:bg-gray-900">
            {user.isSignedIn && (
              <>
                <li>
                  <Link
                    href="/"
                    className="light:text-black block rounded py-2 pl-3 pr-4 dark:bg-gray-800 dark:text-white md:bg-transparent md:p-0 md:text-blue-700 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Create a Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/punishments"
                    className="light:text-black block rounded py-2 pl-3 pr-4 dark:bg-gray-800 dark:text-white md:bg-transparent md:p-0 md:text-blue-700 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Manage punishments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/treasury"
                    className="light:text-black block rounded py-2 pl-3 pr-4 dark:bg-gray-800 dark:text-white md:bg-transparent md:p-0 md:text-blue-700 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Team treasury
                  </Link>
                </li>
              </>
            )}
            {!user.isSignedIn && (
              <li>
                <SignInButton>
                  <span className="cursor-pointer text-white hover:text-blue-500">
                    Sign In
                  </span>
                </SignInButton>
              </li>
            )}
            <li>
              <UserButton />
            </li>

            <li>
              <button
                onClick={() =>
                  theme == "dark" ? setTheme("light") : setTheme("dark")
                }
                id="theme-toggle"
                data-tooltip-target="tooltip-toggle"
                type="button"
                className="mt-5 rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 md:mt-0"
              >
                <svg
                  aria-hidden="true"
                  id="theme-toggle-dark-icon"
                  className={
                    "h-5 w-5" + (currentTheme === "dark" ? "" : " hidden")
                  }
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <svg
                  aria-hidden="true"
                  id="theme-toggle-light-icon"
                  className={
                    "h-5 w-5" + (currentTheme === "light" ? "" : " hidden")
                  }
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Toggle dark mode</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
