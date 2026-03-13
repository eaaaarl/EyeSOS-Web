'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/features/admin/components/layouts/site-header"
import { OverviewTab } from "@/features/admin/dashboard/components/overview-tab"
import { TimePatternsTab } from "@/features/admin/dashboard/components/time-patterns-tab"
import { HotspotsTab } from "@/features/admin/dashboard/components/hotspots-tab"
import { SeverityTab } from "@/features/admin/dashboard/components/severity-tab"
import { TeamsOverviewTab } from "@/features/admin/dashboard/components/teams-overview-tab"
import { PredictTab } from "@/features/admin/dashboard/components/predict-tab"
import { useGetHistoricalAccidentsQuery } from "@/features/admin/api/adminApi"
import { COLORS, SEVERITY_COLORS } from "@/features/admin/dashboard/constants"
export default function AdminPage() {


    const { data } = useGetHistoricalAccidentsQuery()

    const TotalAccidents = data?.historical_accidents.length ?? 0;

    const dates = data?.historical_accidents?.map(a => new Date(a.date_clean).getFullYear()) ?? [];
    const minYear = Math.min(...dates);
    const maxYear = Math.max(...dates);
    const yearRange = `${minYear}-${maxYear}`;

    const totalFatalities = data?.historical_accidents?.reduce((acc, a) => acc + a.fatalities, 0);
    const fatalIncidents = data?.historical_accidents?.filter(a => a.fatalities > 0).length ?? 0;
    const totalIncidents = data?.historical_accidents?.length ?? 0;
    const subFatalities = `${(fatalIncidents / totalIncidents * 100).toFixed(1)}% of incidents`;

    const totalInjured = data?.historical_accidents?.reduce((acc, a) => acc + a.injured, 0);
    const injuredPersons = data?.historical_accidents?.filter(a => a.injured > 0).length ?? 0;
    const subInjured = `${(injuredPersons / totalIncidents * 100).toFixed(1)}% of incidents`;

    const collisionRate = data?.historical_accidents?.filter(a => a.incident_type === "Collision").length ?? 0;
    const subCollisionRate = `${(collisionRate / totalIncidents * 100).toFixed(1)}% of incidents`;

    // Chart incidents by year
    const yearData = Object.entries(
        data?.historical_accidents?.reduce((acc, a) => {
            const year = new Date(a.date_clean).getFullYear().toString();
            acc[year] = (acc[year] ?? 0) + 1;
            return acc;
        }, {} as Record<string, number>) ?? {}
    )
        .map(([year, incidents]) => ({ year, incidents }))
        .sort((a, b) => Number(a.year) - Number(b.year));

    // Chart incidents type
    const collisionCount = data?.historical_accidents?.filter(a => a.incident_type === "Collision").length ?? 0;
    const nonCollisionCount = data?.historical_accidents?.filter(a => a.incident_type === "Non-Collision").length ?? 0;

    const incidentTypeData = [
        { name: "Collision", value: collisionCount, color: COLORS.red },
        { name: "Non-Collision", value: nonCollisionCount, color: COLORS.blue },
    ];


    // Chart severity
    const severityData = Object.entries(
        data?.historical_accidents?.reduce((acc, a) => {
            acc[a.severity] = (acc[a.severity] ?? 0) + 1;
            return acc;
        }, {} as Record<string, number>) ?? {}
    ).map(([name, value]) => ({
        name,
        value,
        color: SEVERITY_COLORS[name] ?? COLORS.blue,
    }));
    return (
        <>
            <SiteHeader title="Dashboard" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <Tabs defaultValue="overview" className="space-y-4">
                            <TabsList className="h-9">
                                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                                <TabsTrigger value="timePatterns" className="text-xs">Time Patterns</TabsTrigger>
                                <TabsTrigger value="hotspots" className="text-xs">Hotspots</TabsTrigger>
                                <TabsTrigger value="severity" className="text-xs">Severity</TabsTrigger>
                                <TabsTrigger value="teamsOverview" className="text-xs">Teams</TabsTrigger>
                                <TabsTrigger value="predict" className="text-xs">Predict</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="space-y-4">
                                <OverviewTab
                                    totalAccidents={TotalAccidents as number}
                                    subDate={yearRange}
                                    totalFatalities={totalFatalities as number}
                                    subFatalities={subFatalities}
                                    totalInjured={totalInjured as number}
                                    subInjured={subInjured}
                                    collisionRate={collisionRate as number}
                                    subCollisionRate={subCollisionRate}
                                    yearData={yearData}
                                    incidentTypeData={incidentTypeData}
                                    severityData={severityData}
                                />
                            </TabsContent>
                            <TabsContent value="timePatterns" className="space-y-4"><TimePatternsTab /></TabsContent>
                            <TabsContent value="hotspots" className="space-y-4"><HotspotsTab /></TabsContent>
                            <TabsContent value="severity" className="space-y-4"><SeverityTab /></TabsContent>
                            <TabsContent value="teamsOverview" className="space-y-4"><TeamsOverviewTab /></TabsContent>
                            <TabsContent value="predict" className="space-y-4"><PredictTab /></TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}