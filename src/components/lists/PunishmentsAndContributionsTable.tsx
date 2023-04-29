import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { api } from "~/utils/api";

const PunishmentsAndContributionsTable = () => {
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const punishmentsAndContributionList =
    api.team.getAllContributionsAndPunishmentsForTeam.useQuery({
      teamId: actualTeam,
    });
  return (
    <div className="mt-10 flex w-full flex-col rounded-lg">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow">
            <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      {punishmentsAndContributionList.data?.isUserManager && (
                        <>
                          <input
                            id="checkbox-all"
                            aria-describedby="checkbox-1"
                            type="checkbox"
                            className="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                          />
                          <label htmlFor="checkbox-all" className="sr-only">
                            checkbox
                          </label>
                        </>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                  >
                    Product Name
                  </th>

                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                  >
                    Description
                  </th>

                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                  >
                    Price
                  </th>

                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      {punishmentsAndContributionList.data?.isUserManager && (
                        <>
                          <input
                            id="checkbox-194556"
                            aria-describedby="checkbox-1"
                            type="checkbox"
                            className="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                          />
                          <label htmlFor="checkbox-194556" className="sr-only">
                            checkbox
                          </label>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                      Education Dashboard
                    </div>
                    <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Html templates
                    </div>
                  </td>

                  <td className="max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                    Start developing with an open-source library of over 450+ UI
                    components, sections, and pages built with the utility
                    classes from Tailwind CSS and designed in Figma.
                  </td>

                  <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                    $149
                  </td>

                  <td className="space-x-2 whitespace-nowrap p-4">
                    <button
                      type="button"
                      id="updateProductButton"
                      data-drawer-target="drawer-update-product-default"
                      data-drawer-show="drawer-update-product-default"
                      aria-controls="drawer-update-product-default"
                      data-drawer-placement="right"
                      className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white focus:ring-4"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path
                          fillRule="evenodd"
                          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Update
                    </button>
                    <button
                      type="button"
                      id="deleteProductButton"
                      data-drawer-target="drawer-delete-product-default"
                      data-drawer-show="drawer-delete-product-default"
                      aria-controls="drawer-delete-product-default"
                      data-drawer-placement="right"
                      className="inline-flex items-center rounded-lg bg-red-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete item
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunishmentsAndContributionsTable;
