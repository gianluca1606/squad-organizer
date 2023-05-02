"use client";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "~/utils/api";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const NAVBAR_ARRAY = [
  {
    name: "Dashboard",
    href: "/dashboard",
    translationKey: "dashboard",
  },
  {
    name: "Invitations",
    href: "/invitations",
    translationKey: "dashboard",
  },
];

export function NavBar() {
  const [mounted, setMounted] = useState(false);
  const user = useUser();
  const { systemTheme, theme, setTheme } = useTheme();
  const [hamburgerToggler, setHamburgerToggle] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [cookies, setCookie, removeCookie] = useCookies(["theme"]);
  const router = useRouter();
  const [localeCookieVal, setLocaleCookieVal, removeLocaleCookieVal] =
    useCookies(["locale"]);
  const [localeCookie, setLocaleCookie] = useState("");

  useEffect(() => {
    if (!localeCookieVal.locale) {
      setLocaleCookie("en");
      setLocaleCookieVal("locale", "en", { path: "/" });
    } else {
      setLocaleCookie(localeCookieVal.locale);
    }
  }, []);

  const handleChange = (value: string): void => {
    setLocaleCookie(value);
    setLocaleCookieVal("locale", value, { path: "/" });

    router.reload();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleHamburger = () => {
    setHamburgerToggle(!hamburgerToggler);
  };

  const setThemeFunction = (theme: string) => {
    setTheme(theme);
    setCookie("theme", theme, { path: "/" });
    router.reload();
  };
  return (
    <>
      <nav className="border-gray-200 bg-white   dark:bg-background">
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
            <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-background md:mt-0  md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-background">
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
                <Select value={localeCookie} onValueChange={handleChange}>
                  <SelectTrigger className="h-9 w-24">
                    <SelectValue placeholder="Select your preffered language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="de">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          width={40}
                          zoomAndPan="magnify"
                          viewBox="0 0 30 30.000001"
                          height={40}
                          preserveAspectRatio="xMidYMid meet"
                          version="1.0"
                        >
                          <defs>
                            <clipPath id="id1">
                              <path
                                d="M 2.613281 18 L 27.292969 18 L 27.292969 23.722656 L 2.613281 23.722656 Z M 2.613281 18 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id2">
                              <path
                                d="M 2.613281 11 L 27.292969 11 L 27.292969 19 L 2.613281 19 Z M 2.613281 11 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id3">
                              <path
                                d="M 2.613281 5.578125 L 27.292969 5.578125 L 27.292969 12 L 2.613281 12 Z M 2.613281 5.578125 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                          </defs>
                          <g clipPath="url(#id1)">
                            <path
                              fill="rgb(100%, 80.389404%, 1.959229%)"
                              d="M 2.625 20.929688 C 2.625 22.472656 3.851562 23.722656 5.363281 23.722656 L 24.542969 23.722656 C 26.054688 23.722656 27.28125 22.472656 27.28125 20.929688 L 27.28125 18.136719 L 2.625 18.136719 Z M 2.625 20.929688 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id2)">
                            <path
                              fill="rgb(92.939758%, 12.159729%, 14.118958%)"
                              d="M 2.625 11.855469 L 27.28125 11.855469 L 27.28125 18.136719 L 2.625 18.136719 Z M 2.625 11.855469 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id3)">
                            <path
                              fill="rgb(7.839966%, 7.839966%, 7.839966%)"
                              d="M 24.542969 5.578125 L 5.363281 5.578125 C 3.851562 5.578125 2.625 6.828125 2.625 8.367188 L 2.625 11.855469 L 27.28125 11.855469 L 27.28125 8.367188 C 27.28125 6.828125 26.054688 5.578125 24.542969 5.578125 Z M 24.542969 5.578125 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                        </svg>
                      </SelectItem>
                      <SelectItem value="en">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          width={40}
                          zoomAndPan="magnify"
                          viewBox="0 0 30 30.000001"
                          height={40}
                          preserveAspectRatio="xMidYMid meet"
                          version="1.0"
                        >
                          <defs>
                            <clipPath id="id1">
                              <path
                                d="M 2.378906 6.1875 L 27.78125 6.1875 L 27.78125 22.878906 L 2.378906 22.878906 Z M 2.378906 6.1875 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id2">
                              <path
                                d="M 2.378906 7 L 27.78125 7 L 27.78125 9 L 2.378906 9 Z M 2.378906 7 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id3">
                              <path
                                d="M 2.378906 10 L 27.78125 10 L 27.78125 12 L 2.378906 12 Z M 2.378906 10 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id4">
                              <path
                                d="M 2.378906 12 L 27.78125 12 L 27.78125 14 L 2.378906 14 Z M 2.378906 12 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id5">
                              <path
                                d="M 2.378906 15 L 27.78125 15 L 27.78125 17 L 2.378906 17 Z M 2.378906 15 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id6">
                              <path
                                d="M 2.378906 17 L 27.78125 17 L 27.78125 20 L 2.378906 20 Z M 2.378906 17 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id7">
                              <path
                                d="M 2.378906 20 L 27.78125 20 L 27.78125 22 L 2.378906 22 Z M 2.378906 20 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id8">
                              <path
                                d="M 2.378906 6.1875 L 16 6.1875 L 16 16 L 2.378906 16 Z M 2.378906 6.1875 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id9">
                              <path
                                d="M 3 6.1875 L 5 6.1875 L 5 8 L 3 8 Z M 3 6.1875 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id10">
                              <path
                                d="M 5 6.1875 L 7 6.1875 L 7 8 L 5 8 Z M 5 6.1875 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id11">
                              <path
                                d="M 7 6.1875 L 9 6.1875 L 9 8 L 7 8 Z M 7 6.1875 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id12">
                              <path
                                d="M 9 6.1875 L 11 6.1875 L 11 8 L 9 8 Z M 9 6.1875 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id13">
                              <path
                                d="M 11 6.1875 L 13 6.1875 L 13 8 L 11 8 Z M 11 6.1875 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                            <clipPath id="id14">
                              <path
                                d="M 13 6.1875 L 15 6.1875 L 15 8 L 13 8 Z M 13 6.1875 "
                                clipRule="nonzero"
                              />
                            </clipPath>
                          </defs>
                          <g clipPath="url(#id1)">
                            <path
                              fill="rgb(59.609985%, 10.198975%, 12.159729%)"
                              d="M 26.230469 22.878906 L 3.933594 22.878906 C 3.078125 22.878906 2.386719 22.191406 2.386719 21.339844 L 2.386719 7.722656 C 2.386719 6.875 3.078125 6.183594 3.933594 6.183594 L 26.230469 6.183594 C 27.085938 6.183594 27.777344 6.875 27.777344 7.722656 L 27.777344 21.339844 C 27.777344 22.191406 27.085938 22.878906 26.230469 22.878906 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id2)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 27.777344 8.753906 L 2.386719 8.753906 L 2.386719 7.46875 L 27.777344 7.46875 L 27.777344 8.753906 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id3)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 27.777344 11.320312 L 2.386719 11.320312 L 2.386719 10.039062 L 27.777344 10.039062 L 27.777344 11.320312 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id4)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 27.777344 13.890625 L 2.386719 13.890625 L 2.386719 12.605469 L 27.777344 12.605469 L 27.777344 13.890625 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id5)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 27.777344 16.457031 L 2.386719 16.457031 L 2.386719 15.175781 L 27.777344 15.175781 L 27.777344 16.457031 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 27.777344 16.457031 L 2.386719 16.457031 L 2.386719 15.175781 L 27.777344 15.175781 L 27.777344 16.457031 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id6)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 27.777344 19.027344 L 2.386719 19.027344 L 2.386719 17.742188 L 27.777344 17.742188 L 27.777344 19.027344 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id7)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 27.777344 21.59375 L 2.386719 21.59375 L 2.386719 20.3125 L 27.777344 20.3125 L 27.777344 21.59375 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id8)">
                            <path
                              fill="rgb(11.759949%, 32.548523%, 50.19989%)"
                              d="M 15.082031 15.175781 L 2.386719 15.175781 L 2.386719 7.722656 C 2.386719 6.875 3.078125 6.183594 3.933594 6.183594 L 15.082031 6.183594 L 15.082031 15.175781 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id9)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 3.648438 7.488281 L 3.410156 7.613281 L 3.457031 7.347656 L 3.261719 7.160156 L 3.53125 7.121094 L 3.648438 6.882812 L 3.769531 7.121094 L 4.035156 7.160156 L 3.84375 7.347656 L 3.890625 7.613281 L 3.648438 7.488281 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id10)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 5.683594 7.488281 L 5.445312 7.613281 L 5.488281 7.347656 L 5.296875 7.160156 L 5.5625 7.121094 L 5.683594 6.882812 L 5.804688 7.121094 L 6.070312 7.160156 L 5.878906 7.347656 L 5.921875 7.613281 L 5.683594 7.488281 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id11)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 7.71875 7.488281 L 7.480469 7.613281 L 7.523438 7.347656 L 7.332031 7.160156 L 7.597656 7.121094 L 7.71875 6.882812 L 7.835938 7.121094 L 8.105469 7.160156 L 7.910156 7.347656 L 7.957031 7.613281 L 7.71875 7.488281 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id12)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 9.75 7.488281 L 9.511719 7.613281 L 9.558594 7.347656 L 9.363281 7.160156 L 9.632812 7.121094 L 9.75 6.882812 L 9.871094 7.121094 L 10.140625 7.160156 L 9.945312 7.347656 L 9.992188 7.613281 L 9.75 7.488281 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id13)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 11.785156 7.488281 L 11.546875 7.613281 L 11.59375 7.347656 L 11.398438 7.160156 L 11.667969 7.121094 L 11.785156 6.882812 L 11.90625 7.121094 L 12.171875 7.160156 L 11.980469 7.347656 L 12.023438 7.613281 L 11.785156 7.488281 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <g clipPath="url(#id14)">
                            <path
                              fill="rgb(100%, 100%, 100%)"
                              d="M 13.820312 7.488281 L 13.582031 7.613281 L 13.625 7.347656 L 13.433594 7.160156 L 13.699219 7.121094 L 13.820312 6.882812 L 13.941406 7.121094 L 14.207031 7.160156 L 14.011719 7.347656 L 14.058594 7.613281 L 13.820312 7.488281 "
                              fillOpacity={1}
                              fillRule="nonzero"
                            />
                          </g>
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 3.648438 9.203125 L 3.410156 9.332031 L 3.457031 9.066406 L 3.261719 8.878906 L 3.53125 8.839844 L 3.648438 8.597656 L 3.769531 8.839844 L 4.035156 8.878906 L 3.84375 9.066406 L 3.890625 9.332031 L 3.648438 9.203125 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 5.683594 9.203125 L 5.445312 9.332031 L 5.488281 9.066406 L 5.296875 8.878906 L 5.5625 8.839844 L 5.683594 8.597656 L 5.804688 8.839844 L 6.070312 8.878906 L 5.878906 9.066406 L 5.921875 9.332031 L 5.683594 9.203125 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 7.71875 9.203125 L 7.480469 9.332031 L 7.523438 9.066406 L 7.332031 8.878906 L 7.597656 8.839844 L 7.71875 8.597656 L 7.835938 8.839844 L 8.105469 8.878906 L 7.910156 9.066406 L 7.957031 9.332031 L 7.71875 9.203125 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 9.75 9.203125 L 9.511719 9.332031 L 9.558594 9.066406 L 9.363281 8.878906 L 9.632812 8.839844 L 9.75 8.597656 L 9.871094 8.839844 L 10.140625 8.878906 L 9.945312 9.066406 L 9.992188 9.332031 L 9.75 9.203125 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 11.785156 9.203125 L 11.546875 9.332031 L 11.59375 9.066406 L 11.398438 8.878906 L 11.667969 8.839844 L 11.785156 8.597656 L 11.90625 8.839844 L 12.171875 8.878906 L 11.980469 9.066406 L 12.023438 9.332031 L 11.785156 9.203125 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 13.820312 9.203125 L 13.582031 9.332031 L 13.625 9.066406 L 13.433594 8.878906 L 13.699219 8.839844 L 13.820312 8.597656 L 13.941406 8.839844 L 14.207031 8.878906 L 14.011719 9.066406 L 14.058594 9.332031 L 13.820312 9.203125 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 3.648438 12.636719 L 3.410156 12.761719 L 3.457031 12.496094 L 3.261719 12.308594 L 3.53125 12.269531 L 3.648438 12.027344 L 3.769531 12.269531 L 4.035156 12.308594 L 3.84375 12.496094 L 3.890625 12.761719 L 3.648438 12.636719 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 5.683594 12.636719 L 5.445312 12.761719 L 5.488281 12.496094 L 5.296875 12.308594 L 5.5625 12.269531 L 5.683594 12.027344 L 5.804688 12.269531 L 6.070312 12.308594 L 5.878906 12.496094 L 5.921875 12.761719 L 5.683594 12.636719 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 7.71875 12.636719 L 7.480469 12.761719 L 7.523438 12.496094 L 7.332031 12.308594 L 7.597656 12.269531 L 7.71875 12.027344 L 7.835938 12.269531 L 8.105469 12.308594 L 7.910156 12.496094 L 7.957031 12.761719 L 7.71875 12.636719 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 9.75 12.636719 L 9.511719 12.761719 L 9.558594 12.496094 L 9.363281 12.308594 L 9.632812 12.269531 L 9.75 12.027344 L 9.871094 12.269531 L 10.140625 12.308594 L 9.945312 12.496094 L 9.992188 12.761719 L 9.75 12.636719 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 11.785156 12.636719 L 11.546875 12.761719 L 11.59375 12.496094 L 11.398438 12.308594 L 11.667969 12.269531 L 11.785156 12.027344 L 11.90625 12.269531 L 12.171875 12.308594 L 11.980469 12.496094 L 12.023438 12.761719 L 11.785156 12.636719 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 13.820312 12.636719 L 13.582031 12.761719 L 13.625 12.496094 L 13.433594 12.308594 L 13.699219 12.269531 L 13.820312 12.027344 L 13.941406 12.269531 L 14.207031 12.308594 L 14.011719 12.496094 L 14.058594 12.761719 L 13.820312 12.636719 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 3.648438 10.921875 L 3.410156 11.046875 L 3.457031 10.78125 L 3.261719 10.59375 L 3.53125 10.554688 L 3.648438 10.3125 L 3.769531 10.554688 L 4.035156 10.59375 L 3.84375 10.78125 L 3.890625 11.046875 L 3.648438 10.921875 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 5.683594 10.921875 L 5.445312 11.046875 L 5.488281 10.78125 L 5.296875 10.59375 L 5.5625 10.554688 L 5.683594 10.3125 L 5.804688 10.554688 L 6.070312 10.59375 L 5.878906 10.78125 L 5.921875 11.046875 L 5.683594 10.921875 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 7.71875 10.921875 L 7.480469 11.046875 L 7.523438 10.78125 L 7.332031 10.59375 L 7.597656 10.554688 L 7.71875 10.3125 L 7.835938 10.554688 L 8.105469 10.59375 L 7.910156 10.78125 L 7.957031 11.046875 L 7.71875 10.921875 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 9.75 10.921875 L 9.511719 11.046875 L 9.558594 10.78125 L 9.363281 10.59375 L 9.632812 10.554688 L 9.75 10.3125 L 9.871094 10.554688 L 10.140625 10.59375 L 9.945312 10.78125 L 9.992188 11.046875 L 9.75 10.921875 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 11.785156 10.921875 L 11.546875 11.046875 L 11.59375 10.78125 L 11.398438 10.59375 L 11.667969 10.554688 L 11.785156 10.3125 L 11.90625 10.554688 L 12.171875 10.59375 L 11.980469 10.78125 L 12.023438 11.046875 L 11.785156 10.921875 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 13.820312 10.921875 L 13.582031 11.046875 L 13.625 10.78125 L 13.433594 10.59375 L 13.699219 10.554688 L 13.820312 10.3125 L 13.941406 10.554688 L 14.207031 10.59375 L 14.011719 10.78125 L 14.058594 11.046875 L 13.820312 10.921875 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 3.648438 14.351562 L 3.410156 14.476562 L 3.457031 14.210938 L 3.261719 14.023438 L 3.53125 13.984375 L 3.648438 13.746094 L 3.769531 13.984375 L 4.035156 14.023438 L 3.84375 14.210938 L 3.890625 14.476562 L 3.648438 14.351562 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 5.683594 14.351562 L 5.445312 14.476562 L 5.488281 14.210938 L 5.296875 14.023438 L 5.5625 13.984375 L 5.683594 13.746094 L 5.804688 13.984375 L 6.070312 14.023438 L 5.878906 14.210938 L 5.921875 14.476562 L 5.683594 14.351562 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 7.71875 14.351562 L 7.480469 14.476562 L 7.523438 14.210938 L 7.332031 14.023438 L 7.597656 13.984375 L 7.71875 13.746094 L 7.835938 13.984375 L 8.105469 14.023438 L 7.910156 14.210938 L 7.957031 14.476562 L 7.71875 14.351562 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 9.75 14.351562 L 9.511719 14.476562 L 9.558594 14.210938 L 9.363281 14.023438 L 9.632812 13.984375 L 9.75 13.746094 L 9.871094 13.984375 L 10.140625 14.023438 L 9.945312 14.210938 L 9.992188 14.476562 L 9.75 14.351562 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 11.785156 14.351562 L 11.546875 14.476562 L 11.59375 14.210938 L 11.398438 14.023438 L 11.667969 13.984375 L 11.785156 13.746094 L 11.90625 13.984375 L 12.171875 14.023438 L 11.980469 14.210938 L 12.023438 14.476562 L 11.785156 14.351562 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 13.820312 14.351562 L 13.582031 14.476562 L 13.625 14.210938 L 13.433594 14.023438 L 13.699219 13.984375 L 13.820312 13.746094 L 13.941406 13.984375 L 14.207031 14.023438 L 14.011719 14.210938 L 14.058594 14.476562 L 13.820312 14.351562 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 4.667969 8.347656 L 4.425781 8.472656 L 4.472656 8.207031 L 4.28125 8.019531 L 4.546875 7.980469 L 4.667969 7.738281 L 4.785156 7.980469 L 5.054688 8.019531 L 4.859375 8.207031 L 4.90625 8.472656 L 4.667969 8.347656 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 6.699219 8.347656 L 6.460938 8.472656 L 6.507812 8.207031 L 6.3125 8.019531 L 6.582031 7.980469 L 6.699219 7.738281 L 6.820312 7.980469 L 7.085938 8.019531 L 6.894531 8.207031 L 6.941406 8.472656 L 6.699219 8.347656 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 8.734375 8.347656 L 8.496094 8.472656 L 8.542969 8.207031 L 8.347656 8.019531 L 8.617188 7.980469 L 8.734375 7.738281 L 8.855469 7.980469 L 9.121094 8.019531 L 8.929688 8.207031 L 8.972656 8.472656 L 8.734375 8.347656 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 10.769531 8.347656 L 10.53125 8.472656 L 10.574219 8.207031 L 10.382812 8.019531 L 10.648438 7.980469 L 10.769531 7.738281 L 10.886719 7.980469 L 11.15625 8.019531 L 10.960938 8.207031 L 11.007812 8.472656 L 10.769531 8.347656 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 12.804688 8.347656 L 12.5625 8.472656 L 12.609375 8.207031 L 12.417969 8.019531 L 12.683594 7.980469 L 12.804688 7.738281 L 12.921875 7.980469 L 13.191406 8.019531 L 12.996094 8.207031 L 13.042969 8.472656 L 12.804688 8.347656 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 4.667969 10.0625 L 4.425781 10.1875 L 4.472656 9.921875 L 4.28125 9.734375 L 4.546875 9.695312 L 4.667969 9.457031 L 4.785156 9.695312 L 5.054688 9.734375 L 4.859375 9.921875 L 4.90625 10.1875 L 4.667969 10.0625 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 6.699219 10.0625 L 6.460938 10.1875 L 6.507812 9.921875 L 6.3125 9.734375 L 6.582031 9.695312 L 6.699219 9.457031 L 6.820312 9.695312 L 7.085938 9.734375 L 6.894531 9.921875 L 6.941406 10.1875 L 6.699219 10.0625 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 8.734375 10.0625 L 8.496094 10.1875 L 8.542969 9.921875 L 8.347656 9.734375 L 8.617188 9.695312 L 8.734375 9.457031 L 8.855469 9.695312 L 9.121094 9.734375 L 8.929688 9.921875 L 8.972656 10.1875 L 8.734375 10.0625 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 10.769531 10.0625 L 10.53125 10.1875 L 10.574219 9.921875 L 10.382812 9.734375 L 10.648438 9.695312 L 10.769531 9.457031 L 10.886719 9.695312 L 11.15625 9.734375 L 10.960938 9.921875 L 11.007812 10.1875 L 10.769531 10.0625 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 12.804688 10.0625 L 12.5625 10.1875 L 12.609375 9.921875 L 12.417969 9.734375 L 12.683594 9.695312 L 12.804688 9.457031 L 12.921875 9.695312 L 13.191406 9.734375 L 12.996094 9.921875 L 13.042969 10.1875 L 12.804688 10.0625 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 4.667969 13.496094 L 4.425781 13.621094 L 4.472656 13.355469 L 4.28125 13.167969 L 4.546875 13.128906 L 4.667969 12.886719 L 4.785156 13.128906 L 5.054688 13.167969 L 4.859375 13.355469 L 4.90625 13.621094 L 4.667969 13.496094 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 6.699219 13.496094 L 6.460938 13.621094 L 6.507812 13.355469 L 6.3125 13.167969 L 6.582031 13.128906 L 6.699219 12.886719 L 6.820312 13.128906 L 7.085938 13.167969 L 6.894531 13.355469 L 6.941406 13.621094 L 6.699219 13.496094 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 8.734375 13.496094 L 8.496094 13.621094 L 8.542969 13.355469 L 8.347656 13.167969 L 8.617188 13.128906 L 8.734375 12.886719 L 8.855469 13.128906 L 9.121094 13.167969 L 8.929688 13.355469 L 8.972656 13.621094 L 8.734375 13.496094 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 10.769531 13.496094 L 10.53125 13.621094 L 10.574219 13.355469 L 10.382812 13.167969 L 10.648438 13.128906 L 10.769531 12.886719 L 10.886719 13.128906 L 11.15625 13.167969 L 10.960938 13.355469 L 11.007812 13.621094 L 10.769531 13.496094 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 12.804688 13.496094 L 12.5625 13.621094 L 12.609375 13.355469 L 12.417969 13.167969 L 12.683594 13.128906 L 12.804688 12.886719 L 12.921875 13.128906 L 13.191406 13.167969 L 12.996094 13.355469 L 13.042969 13.621094 L 12.804688 13.496094 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 4.667969 11.777344 L 4.425781 11.902344 L 4.472656 11.640625 L 4.28125 11.449219 L 4.546875 11.414062 L 4.667969 11.171875 L 4.785156 11.414062 L 5.054688 11.449219 L 4.859375 11.640625 L 4.90625 11.902344 L 4.667969 11.777344 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 6.699219 11.777344 L 6.460938 11.902344 L 6.507812 11.640625 L 6.3125 11.449219 L 6.582031 11.414062 L 6.699219 11.171875 L 6.820312 11.414062 L 7.085938 11.449219 L 6.894531 11.640625 L 6.941406 11.902344 L 6.699219 11.777344 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 8.734375 11.777344 L 8.496094 11.902344 L 8.542969 11.640625 L 8.347656 11.449219 L 8.617188 11.414062 L 8.734375 11.171875 L 8.855469 11.414062 L 9.121094 11.449219 L 8.929688 11.640625 L 8.972656 11.902344 L 8.734375 11.777344 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 10.769531 11.777344 L 10.53125 11.902344 L 10.574219 11.640625 L 10.382812 11.449219 L 10.648438 11.414062 L 10.769531 11.171875 L 10.886719 11.414062 L 11.15625 11.449219 L 10.960938 11.640625 L 11.007812 11.902344 L 10.769531 11.777344 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                          <path
                            fill="rgb(100%, 100%, 100%)"
                            d="M 12.804688 11.777344 L 12.5625 11.902344 L 12.609375 11.640625 L 12.417969 11.449219 L 12.683594 11.414062 L 12.804688 11.171875 L 12.921875 11.414062 L 13.191406 11.449219 L 12.996094 11.640625 L 13.042969 11.902344 L 12.804688 11.777344 "
                            fillOpacity={1}
                            fillRule="nonzero"
                          />
                        </svg>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                    theme == "dark"
                      ? setThemeFunction("light")
                      : setThemeFunction("dark")
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
    </>
  );
}
