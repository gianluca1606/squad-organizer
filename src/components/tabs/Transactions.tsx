import { FC, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useToast } from "~/components/ui/use-toast";
import { CreateOrEditTeamBalanceEntry } from "../forms/CreateOrEditTeamBalanceEntry";
import { api } from "~/utils/api";
import { Checkbox } from "~/components/ui/checkbox";

const Transactions: FC = () => {
  const { toast } = useToast();
  const [actualTeam, setActualTeamFunction] = useLocalStorage("teamId", "");
  const [actualTeamState, setActualTeamState] = useState<string>("");

  const allTransactions = api.teamBalance.getAllForTeam.useQuery({
    teamId: actualTeam,
  });

  useEffect(() => {
    if (actualTeam) {
      setActualTeamState(actualTeam);
    }
  }, [actualTeam]);
  return (
    <div className="flex justify-center ">
      <Card className="relative mt-4 block w-full  p-0 sm:w-full md:p-6 xl:w-10/12 2xl:w-8/12">
        <CardHeader>
          <CardTitle> Team Balance</CardTitle>
          <CardDescription>
            Here you can see all punishments and contributions types of your
            squad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="absolute  right-0 top-0 ">
            {actualTeamState && (
              <CreateOrEditTeamBalanceEntry edit={false} data={null} />
            )}
          </div>
          <div className="mt-6 flex flex-col">
            <div className="overflow-x-auto rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white"
                        >
                          Member/Sponsorname
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white"
                        >
                          Reason
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white"
                        >
                          Payed
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {allTransactions.data?.list.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                            {transaction.sponsorName
                              ? transaction.sponsorName
                              : transaction.clerkId}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                            {transaction.name}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {transaction.description}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                            {transaction.price}
                          </td>
                          <td>
                            <Checkbox disabled checked={transaction.payed} />
                          </td>
                          <td className="whitespace-nowrap p-4">
                            <span className="mr-2 rounded-md border border-green-100 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:border-green-500 dark:bg-gray-700 dark:text-green-400">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 sm:pt-6">
            <div>
              <button
                className="inline-flex items-center rounded-lg p-2 text-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                type="button"
                data-dropdown-toggle="transactions-dropdown"
              >
                Last 7 days{" "}
                <svg
                  className="ml-2 h-4 w-4"
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
                className="z-50 my-4 hidden list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
                id="transactions-dropdown"
                style={{
                  position: "absolute",
                  inset: "auto auto 0px 0px",
                  margin: 0,
                  transform: "translate3d(99px, 6121px, 0px)",
                }}
                data-popper-placement="top"
                data-popper-reference-hidden
                data-popper-escaped
              >
                <div className="px-4 py-3" role="none">
                  <p
                    className="truncate text-sm font-medium text-gray-900 dark:text-white"
                    role="none"
                  >
                    Sep 16, 2021 - Sep 22, 2021
                  </p>
                </div>
                <ul className="py-1" role="none">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Yesterday
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Today
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Last 7 days
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Last 30 days
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Last 90 days
                    </a>
                  </li>
                </ul>
                <div className="py-1" role="none">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                  >
                    Custom...
                  </a>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <a
                href="#"
                className="text-primary-700 dark:text-primary-500 inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase hover:bg-gray-100 dark:hover:bg-gray-700 sm:text-sm"
              >
                Transactions Report
                <svg
                  className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
