import { ChangeEvent, FC, useEffect, useState } from "react";
import { useDebounce, useLocalStorage } from "usehooks-ts";
import { PublicUser } from "~/interfaces/PublicUser";
import { api } from "~/utils/api";
import { SkeletonList } from "./SkeletonList";
import { getNameOrMail } from "~/utils/getNameOrMail";

const TeamMembersList: FC = () => {
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const [listData, setListData] = useState<PublicUser[] | null | undefined>(
    null
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(searchValue, 500);

  const teamMembers = api.team.getMembers.useQuery({ teamId: actualTeam });
  useEffect(() => {
    if (teamMembers.data) {
      setListData(teamMembers.data);
    }
  }, [teamMembers.data]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    const filteredData = teamMembers.data?.filter((member) => {
      const name = getNameOrMail(member);
      return name.toLowerCase().includes(debouncedValue.toLowerCase());
    });
    setListData(filteredData);
    // Do fetch here...
    // Triggers when "debouncedValue" changes
  }, [debouncedValue]);
  return (
    <div className="mt-6 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:h-fit sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Squad Members
      </h3>

      <div className="sm:flex">
        <div className="mb-3  items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
          <div className="relative mb-4  mt-1 lg:w-64 lg:pr-3 xl:w-96">
            <label
              htmlFor="default-search"
              className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                value={searchValue}
                onChange={handleChange}
                placeholder="Search for members"
                disabled={teamMembers.isLoading}
                type="search"
                id="default-search"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div
        id="fullWidthTabContent"
        className="border-t border-gray-200 dark:border-gray-600"
      >
        <div
          className="pt-4"
          id="faq"
          role="tabpanel"
          aria-labelledby="faq-tab"
        >
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {" "}
            {teamMembers.isLoading && <SkeletonList />}
            {listData?.map((member) => (
              <li className="py-3 sm:py-4" key={member.id}>
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center">
                    <img
                      className="h-10 w-10 flex-shrink-0"
                      src={member.profileImageUrl}
                      alt="imac image"
                    />
                    <div className="ml-3">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {getNameOrMail(member)}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    €445,467
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="hidden pt-4"
          id="about"
          role="tabpanel"
          aria-labelledby="about-tab"
        >
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://flowbite-admin-dashboard.vercel.app/images/users/neil-sims.png"
                    alt="Neil image"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 dark:text-white">
                    Neil Sims
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    email@flowbite.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $3320
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://flowbite-admin-dashboard.vercel.app/images/users/bonnie-green.png"
                    alt="Neil image"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 dark:text-white">
                    Bonnie Green
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    email@flowbite.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $2467
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://flowbite-admin-dashboard.vercel.app/images/users/michael-gough.png"
                    alt="Neil image"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 dark:text-white">
                    Michael Gough
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    email@flowbite.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $2235
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://flowbite-admin-dashboard.vercel.app/images/users/thomas-lean.png"
                    alt="Neil image"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 dark:text-white">
                    Thomes Lean
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    email@flowbite.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $1842
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://flowbite-admin-dashboard.vercel.app/images/users/lana-byrd.png"
                    alt="Neil image"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 dark:text-white">
                    Lana Byrd
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    email@flowbite.com
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $1044
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* Card Footer */}
    </div>
  );
};

export default TeamMembersList;
