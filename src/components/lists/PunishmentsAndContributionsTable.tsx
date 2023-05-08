import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { api } from "~/utils/api";
import { CreateOrEditPunishmentOrContributionDialog } from "../forms/CreateOrEditPunishmentDialog";
import { DeleteContributionOrPunishmentType } from "../forms/DeleteContributionOrPunishmentDialog";
import { PunishmentOrContributionType } from "@prisma/client";

const PunishmentsAndContributionsTable = ({
  data,
  loading,
  refetchPunishmentAndContributionList,
  isUserManager,
}: {
  data: PunishmentOrContributionType[] | undefined;
  loading: boolean;
  isUserManager: boolean | undefined;
  refetchPunishmentAndContributionList: () => void;
}) => {
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");

  return (
    <div className="mt-10 flex w-full flex-col rounded-lg">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow">
            <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                  >
                    Name
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
                {data &&
                  data
                    .sort((a, b) =>
                      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
                    )
                    .map((contributionOrPunishment) => (
                      <tr
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        key={contributionOrPunishment.id}
                      >
                        <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                          <div className="text-base font-semibold text-gray-900 dark:text-white">
                            {contributionOrPunishment.name}
                          </div>
                        </td>

                        <td className="max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                          {contributionOrPunishment.description}
                        </td>

                        <td className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                          {contributionOrPunishment.price}
                        </td>

                        {isUserManager && (
                          <td className="space-x-2 whitespace-nowrap p-4">
                            <CreateOrEditPunishmentOrContributionDialog
                              refetchPunishmentAndContributionList={() => {
                                refetchPunishmentAndContributionList();
                              }}
                              edit={true}
                              data={contributionOrPunishment}
                            ></CreateOrEditPunishmentOrContributionDialog>
                            <DeleteContributionOrPunishmentType
                              punishmentOrContributionId={
                                contributionOrPunishment.id
                              }
                            ></DeleteContributionOrPunishmentType>
                          </td>
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunishmentsAndContributionsTable;
