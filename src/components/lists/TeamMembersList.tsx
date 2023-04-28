import { FC } from "react";
import { useLocalStorage } from "usehooks-ts";
import { PublicUser } from "~/interfaces/PublicUser";
import { api } from "~/utils/api";

const TeamMembersList: FC = () => {
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const teamMembers = api.team.getMembers.useQuery({ teamId: actualTeam });
  function getNameOrMail(member: PublicUser) {
    if (member.firstName && member.lastName) {
      return member.firstName + " " + member.lastName;
    } else {
      return member.emailAddresses[0]?.emailAddress;
    }
  }

  return (
    <div className="mt-6 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:h-fit sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Squad Members
      </h3>
      <div className="sm:flex">
        <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
          <form className="lg:pr-3" action="#" method="GET">
            <label htmlFor="users-search" className="sr-only">
              Search
            </label>
            <div className="relative mb-4  mt-1 lg:w-64 xl:w-96">
              <input
                type="text"
                name="email"
                id="users-search"
                className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Search for members"
              />
            </div>
          </form>
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
            {teamMembers.data?.map((member) => (
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
                    $445,467
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
