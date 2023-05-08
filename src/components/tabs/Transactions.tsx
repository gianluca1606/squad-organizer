import { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useToast } from "~/components/ui/use-toast";
import { CreateOrEditTeamBalanceEntry } from "../forms/CreateOrEditTeamBalanceEntry";
import { RouterOutputs, api } from "~/utils/api";
import { Checkbox } from "~/components/ui/checkbox";
import { getNameOrMail } from "~/utils/getNameOrMail";
import { useLocalStorage, usePagination } from "@mantine/hooks";
const columns = [
  {
    Header: "Name/Sponsor",
    accessor: "name", // accessor is the "key" in the data
  },
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "Reason",
    accessor: "reason",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Payed",
    accessor: "payed",
  },
  {
    Header: "Actions",
    accessor: "actions",
  },
];

type teamBalanceList =
  RouterOutputs["teamBalance"]["getAllForTeam"]["listWithClerks"]["0"];
const Transactions: FC = () => {
  const { toast } = useToast();
  const [actualTeam, setActualTeamFunction] = useLocalStorage({
    defaultValue: "",
    key: "teamId",
  });
  const punishmentsAndContributionList =
    api.team.getAllContributionsAndPunishmentsForTeam.useQuery(
      {
        teamId: actualTeam,
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );
  const allMembers = api.team.getMembers.useQuery(
    {
      teamId: actualTeam,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: actualTeam !== "",
    }
  );
  const [actualTeamState, setActualTeamState] = useState<string>("");
  const [firstLoad, setFirstLoad] = useState<boolean>(false);
  const [balanceTableData, setBalanceTableData] = useState<teamBalanceList[]>(
    []
  );

  const allTransactions = api.teamBalance.getAllForTeam.useQuery(
    {
      teamId: actualTeam,
    },
    {
      enabled: actualTeamState !== "",
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        if (data.listWithClerks.length === 0) {
          toast({
            title: "No transactions found",
            description: "Create a new one",
          });
        }
        if (firstLoad) {
          const start = (pagination.active - 1) * 10;
          const end = start + 10;
          if (
            data.listWithClerks.slice(start, end).length !==
              balanceTableData.length &&
            Math.ceil(data.listWithClerks.length / 10) ===
              pagination.range.length
          ) {
            setBalanceTableData(data.listWithClerks.slice(start, end));
          }
        }
      },
    }
  );

  const pagination = usePagination({
    total: Math.ceil(
      (allTransactions.data ? allTransactions.data.listWithClerks.length : 0) /
        10
    ),
    initialPage: 1,
    onChange: (page) => {
      const start = (page - 1) * 10;
      const end = start + 10;
      setBalanceTableData(
        allTransactions.data?.listWithClerks.slice(start, end)!
      );
    },
  });

  useEffect(() => {
    if (allTransactions.data && !firstLoad) {
      setFirstLoad(true);
      setBalanceTableData(allTransactions.data.listWithClerks.slice(0, 10));
    }
  }, [allTransactions.data]);

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
              <CreateOrEditTeamBalanceEntry
                refetchBalanceEntries={() => {
                  allTransactions.refetch();
                }}
                punishmentsAndContributionList={
                  punishmentsAndContributionList.data
                }
                edit={false}
                allMembers={allMembers.data}
              />
            )}
          </div>
          <div className="mt-6 flex flex-col">
            <div className="overflow-x-auto rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={column.Header}
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white"
                          >
                            {column.Header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {balanceTableData.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                            {transaction.sponsorName
                              ? transaction.sponsorName
                              : getNameOrMail(transaction.publicUser)}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                            {transaction.description}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {transaction.name}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                            {transaction.price}
                          </td>
                          <td>
                            <Checkbox
                              className="border-black dark:border-white"
                              disabled
                              checked={transaction.payed}
                            />
                          </td>
                          <td className="whitespace-nowrap p-4">
                            <CreateOrEditTeamBalanceEntry
                              refetchBalanceEntries={() => {
                                allTransactions.refetch();
                              }}
                              punishmentsAndContributionList={
                                punishmentsAndContributionList.data
                              }
                              allMembers={allMembers.data}
                              edit={true}
                              data={transaction}
                            ></CreateOrEditTeamBalanceEntry>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <nav aria-label="Page navigation ">
            <ul className="mt-2 inline-flex -space-x-px">
              <li>
                <button
                  disabled={pagination.active === 1}
                  onClick={pagination.previous}
                  className={
                    (pagination.active === 1 ? "cursor-not-allowed" : "") +
                    " ml-0 rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }
                >
                  Previous
                </button>
              </li>
              {pagination.range.map((page) => (
                <li key={page}>
                  <button
                    onClick={() => pagination.setPage(page as number)}
                    className={`${
                      pagination.active === (page as number)
                        ? "bg-primary-50 border-primary-500 text-primary-600"
                        : "border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    } rounded-md border-b border-r border-t px-5 py-2 leading-tight`}
                  >
                    {page}
                  </button>
                </li>
              ))}

              <li>
                <button
                  disabled={
                    pagination.active === (pagination.range as number[]).length
                  }
                  onClick={pagination.next}
                  className={
                    (pagination.active === (pagination.range as number[]).length
                      ? "cursor-not-allowed"
                      : "") +
                    " rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
