"use client";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "~/utils/api";
import { useLocalStorage, useOnClickOutside } from "usehooks-ts";

const NAVBAR_ARRAY = [
  {
    name: "Dashboard",
    href: "/dashboard",
    translationKey: "dashboard",
  },
  {
    name: "Teams",
    href: "/teams",
    translationKey: "dashboard",
  },
  {
    name: "Invitations",
    href: "/invitations",
    translationKey: "dashboard",
  },
  {
    name: "Settings",
    href: "/account-settings",
    translationKey: "dashboard",
  },
];

export function NavBar() {
  const teams = api.team.getTeamsForLoggedInUser.useQuery();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const [mounted, setMounted] = useState(false);
  const user = useUser();
  const { systemTheme, theme, setTheme } = useTheme();
  const [hamburgerToggler, setHamburgerToggle] = useState(false);
  const [switchTeamToggler, setTeamToggler] = useState(false);
  const teamTogglerRef = useRef(null);
  const currentTheme = theme === "system" ? systemTheme : theme;
  const handleClickOutside = () => {
    if (switchTeamToggler) {
      setTeamToggler(!switchTeamToggler);
    }
  };

  useOnClickOutside(teamTogglerRef, handleClickOutside);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleHamburger = () => {
    setHamburgerToggle(!hamburgerToggler);
  };

  const toggleSwitchTeam = () => {
    setTeamToggler(!switchTeamToggler);
  };
  const setActualTeam = (id: string) => {
    setActualTeamFunction(id);
  };

  const getTeamNameForId = () => {
    return (
      teams.data?.find((team) => team.id === actualTeam)?.name || "Select Team"
    );
  };
  return (
    <nav className="border-gray-200 bg-white  dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <Image
            src={
              currentTheme === "dark"
                ? "/logo-no-background.png"
                : "/logo-black.svg"
            }
            width={150}
            height={150}
            alt="Squad Organizer Logo"
          />
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
            hamburgerToggler ? "hidden " : "" + " w-full md:block md:w-auto"
          }
          id="navbar-default"
        >
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0  md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900">
            {user.isLoaded && user.isSignedIn && (
              <>
                {NAVBAR_ARRAY.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="block rounded py-2 pl-3 pr-4 text-black  dark:text-white md:bg-transparent md:p-0 md:text-blue-700 md:dark:text-blue-500"
                      aria-current="page"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </>
            )}

            <li>
              <div className="relative">
                <button
                  id="dropdownDefaultButton"
                  onClick={toggleSwitchTeam}
                  data-dropdown-toggle="dropdown"
                  className="mb-4 inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:mb-0"
                  type="button"
                >
                  {getTeamNameForId()}
                  <svg
                    className="ml-2 h-4 w-4"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {/* Dropdown menu */}
                <div
                  id="dropdown"
                  ref={teamTogglerRef}
                  className={
                    "absolute z-10 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700 " +
                    (switchTeamToggler ? "" : "hidden")
                  }
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    {teams.data?.map((team) => (
                      <li key={team.id}>
                        <button
                          onClick={() => setActualTeam(team.id)}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          {team.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            {user.isLoaded && !user.isSignedIn && (
              <li>
                <Link
                  href="/sign-in"
                  className="cursor-pointer text-white hover:text-blue-500"
                >
                  Sign In
                </Link>
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
                className="block rounded-lg py-2 pl-3 pr-4 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 md:p-1"
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
