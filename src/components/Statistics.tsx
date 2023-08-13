import { useLocalStorage } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/utils/api';

const Statistics = () => {
    const t = useTranslations('Team');

    const { toast } = useToast();
    const [actualTeam, setActualTeamFunction] = useLocalStorage({
        defaultValue: '',
        key: 'teamId',
    });

    const statisticsQueryResult = api.statistic.get.useQuery(
        {
            teamId: actualTeam,
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: actualTeam !== '',
        }
    );

    return (
        <Card className="relative mt-4 block w-full  p-0 sm:w-full md:p-6 xl:w-10/12 2xl:w-8/12">
            <CardHeader>
                <CardTitle> Statistics</CardTitle>
                <CardDescription>Here you can see all the statistics</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                            <h3 className="text-sm font-medium tracking-tight">akt. Kontostand</h3>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground">
                                <line x1={12} x2={12} y1={2} y2={22} />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statisticsQueryResult.data?.actualBalance}€</div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                            <h3 className="text-sm font-medium tracking-tight">offene Posten</h3>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx={9} cy={7} r={4} />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">
                                {statisticsQueryResult.data?.allNotPayedEntriesValue}€
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                            <h3 className="text-sm font-medium tracking-tight">Highest Sponsor payment</h3>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground">
                                <rect width={20} height={14} x={2} y={5} rx={2} />
                                <line x1={2} x2={22} y1={10} y2={10} />
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">
                                {statisticsQueryResult.data?.highestSponsorEntry?.price ?? 0}€
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {statisticsQueryResult.data?.highestSponsorEntry?.sponsorName}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                            <h3 className="text-sm font-medium tracking-tight">Totaler umsatz</h3>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{statisticsQueryResult.data?.totalVolume} €</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Statistics;
