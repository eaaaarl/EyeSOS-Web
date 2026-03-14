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
import { COLORS, DAY_MAP, DAY_ORDER, LIGHTING_COLORS, MONTH_NAMES, SEVERITY_COLORS, TOD_COLORS } from "@/features/admin/dashboard/constants"
import { useMemo } from "react"
export default function AdminPage() {
    const { data } = useGetHistoricalAccidentsQuery()
    console.log(JSON.stringify(data?.historical_accidents[0], null, 2))
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

    // Cards chart for Day
    const todData = Object.entries(
        data?.historical_accidents?.reduce((acc, a) => {
            acc[a.time_of_day] = (acc[a.time_of_day] ?? 0) + 1;
            return acc;
        }, {} as Record<string, number>) ?? {}
    ).map(([name, value]) => ({
        name,
        value,
        color: TOD_COLORS[name] ?? COLORS.blue,
    }));

    // for useMemo
    const historical_accidents = data?.historical_accidents;

    // Charts incidents by hour of day
    // Derive hourData from historical_accidents
    const hourData = useMemo(() => {
        const counts = Array.from({ length: 24 }, (_, i) => ({
            hour: `${i.toString().padStart(2, '0')}:00`,
            incidents: 0,
        }));

        if (!historical_accidents?.length) return counts; // ← guard

        historical_accidents.forEach((acc) => {
            const h = Number(acc.hour);
            if (!isNaN(h) && h >= 0 && h <= 23) {
                counts[h].incidents += 1;
            }
        });

        return counts;
    }, [historical_accidents]);

    // Chart incidents by month
    const monthData = useMemo(() => {
        const counts = Array.from({ length: 12 }, (_, i) => ({
            month: MONTH_NAMES[i],
            incidents: 0,
        }));

        if (!historical_accidents?.length) return counts;

        historical_accidents.forEach((acc) => {
            const m = Number(acc.month);
            if (!isNaN(m) && m >= 1 && m <= 12) {
                counts[m - 1].incidents += 1; // ← month is 1-indexed, array is 0-indexed
            }
        });

        return counts;
    }, [historical_accidents]);

    // Chart incidents by day of week
    const dowData = useMemo(() => {
        const counts = DAY_ORDER.map(day => ({ day, incidents: 0 }));

        if (!historical_accidents?.length) return counts;

        historical_accidents.forEach((acc) => {
            const short = DAY_MAP[acc.dayname];
            if (short) {
                const entry = counts.find(c => c.day === short);
                if (entry) entry.incidents += 1;
            }
        });

        return counts;
    }, [historical_accidents]);

    // Charts incidents per barangay
    const barangayData = useMemo(() => {
        if (!historical_accidents?.length) return [];

        const counts: Record<string, number> = {};

        historical_accidents.forEach((acc) => {
            if (acc.barangay) {
                counts[acc.barangay] = (counts[acc.barangay] ?? 0) + 1;
            }
        });

        return Object.entries(counts)
            .map(([name, incidents]) => ({ name, incidents }))
            .sort((a, b) => b.incidents - a.incidents)
            .slice(0, 10); // ← top 10 barangays
    }, [historical_accidents]);


    // Charts lighting condition
    const lightingData = useMemo(() => {
        if (!historical_accidents?.length) return [];

        const counts: Record<string, number> = {};

        historical_accidents.forEach((acc) => {
            const key = acc.lighting ?? "Unknown";
            counts[key] = (counts[key] ?? 0) + 1;
        });

        return Object.entries(counts)
            .map(([name, value]) => ({
                name,
                value,
                color: LIGHTING_COLORS[name] ?? COLORS.blue,
            }))
            .sort((a, b) => b.value - a.value);
    }, [historical_accidents]);

    // Charts road type
    const roadTypeData = useMemo(() => {
        if (!historical_accidents?.length) return [];

        const counts: Record<string, number> = {};

        historical_accidents.forEach((acc) => {
            const key = acc.road_type ?? "Unknown";
            counts[key] = (counts[key] ?? 0) + 1;
        });

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [historical_accidents]);


    // Charts severity by barangay
    const severityByBrgy = useMemo(() => {
        if (!historical_accidents?.length) return [];

        const counts: Record<string, { name: string; Minor: number; Moderate: number; Serious: number; Fatal: number }> = {};

        historical_accidents.forEach((acc) => {
            const brgy = acc.barangay ?? "Unknown";
            if (!counts[brgy]) {
                counts[brgy] = { name: brgy, Minor: 0, Moderate: 0, Serious: 0, Fatal: 0 };
            }
            const sev = acc.severity as keyof typeof counts[string];
            if (sev in counts[brgy]) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (counts[brgy] as any)[sev] += 1;
            }
        });

        return Object.values(counts)
            .map(d => ({ ...d, total: d.Minor + d.Moderate + d.Serious + d.Fatal }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ total, ...rest }) => rest);
    }, [historical_accidents]);

    // Chart for fatal risk
    const fatalRisk = useMemo(() => {
        if (!historical_accidents?.length) return [];

        const counts: Record<string, { name: string; incidents: number; fatal: number }> = {};

        historical_accidents.forEach((acc) => {
            const brgy = acc.barangay ?? "Unknown";
            if (!counts[brgy]) {
                counts[brgy] = { name: brgy, incidents: 0, fatal: 0 };
            }
            counts[brgy].incidents += 1;
            if (acc.severity === "Fatal") {
                counts[brgy].fatal += 1;
            }
        });

        return Object.values(counts)
            .map(d => ({
                ...d,
                rate: Math.round((d.fatal / d.incidents) * 100),
            }))
            .sort((a, b) => b.rate - a.rate);
    }, [historical_accidents]);

    // Card for responder team
    const responderCounts = useMemo(() => {
        if (!historical_accidents?.length) return {};

        const counts: Record<string, number> = {};
        historical_accidents.forEach((a) => {
            const key = a.responders ?? "Unassigned";
            counts[key] = (counts[key] ?? 0) + 1;
        });
        return counts;
    }, [historical_accidents]);

    const teamNames = Object.keys(responderCounts)
        .filter(k => k !== "Unassigned")
        .sort()
        .join(" + "); // → "Team 1 + Team 2 + Team 3 + Team 4"

    const responderStats = useMemo(() => {
        if (!historical_accidents?.length) return null;

        const acc = historical_accidents;

        const combinedResponses = Object.entries(responderCounts)
            .filter(([k]) => k !== "Unassigned")
            .reduce((sum, [, v]) => sum + v, 0);

        const unassigned = responderCounts["Unassigned"] ?? 0;

        const brgyCounts: Record<string, number> = {};
        acc.forEach((a) => {
            if (a.barangay) brgyCounts[a.barangay] = (brgyCounts[a.barangay] ?? 0) + 1;
        });
        const topBarangay = Object.entries(brgyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

        const yearCounts: Record<string, number> = {};
        acc.forEach((a) => {
            if (!a.responders || a.responders === "Unassigned") return;
            const year = a.date_clean?.split("-")[0];
            if (year) yearCounts[year] = (yearCounts[year] ?? 0) + 1;
        });
        const [peakYear, peakYearCount] = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0] ?? ["—", 0];

        return { combinedResponses, unassigned, topBarangay, peakYear, peakYearCount };
    }, [historical_accidents, responderCounts]);

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
                            <TabsContent value="timePatterns" className="space-y-4">
                                <TimePatternsTab
                                    todData={todData}
                                    totalAccidents={TotalAccidents as number}
                                    hourData={hourData}
                                    monthData={monthData}
                                    dowData={dowData}
                                />
                            </TabsContent>
                            <TabsContent value="hotspots" className="space-y-4">
                                <HotspotsTab
                                    barangayData={barangayData}
                                    lightingData={lightingData}
                                    roadTypeData={roadTypeData}
                                />
                            </TabsContent>
                            <TabsContent value="severity" className="space-y-4">
                                <SeverityTab
                                    severityData={severityData}
                                    severityByBrgy={severityByBrgy}
                                    fatalRisk={fatalRisk}
                                />
                            </TabsContent>
                            <TabsContent value="teamsOverview" className="space-y-4">
                                <TeamsOverviewTab
                                    responderStats={responderStats}
                                    teamNames={teamNames}
                                />
                            </TabsContent>
                            <TabsContent value="predict" className="space-y-4">
                                <PredictTab />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}