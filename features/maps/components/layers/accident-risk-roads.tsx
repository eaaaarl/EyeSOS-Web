"use client";
import { useEffect, useState } from "react";
import { Polyline, Tooltip } from "react-leaflet";

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "critical" | "high" | "moderate" | "minor" | "none";

interface RoadSegment {
    id: number;
    coordinates: [number, number][];
    name: string;
    riskLevel: RiskLevel;
    riskScore: number;
    accidentCount: number;
}

interface OverpassWay {
    id: number;
    geometry: { lat: number; lon: number }[];
    tags?: { name?: string; highway?: string };
}

// ─── Config ───────────────────────────────────────────────────────────────────

const RISK_COLORS: Record<RiskLevel, string> = {
    critical: "#dc2626",
    high: "#ea580c",
    moderate: "#ca8a04",
    minor: "#16a34a",
    none: "#3b82f6",
};

const RISK_OPACITY: Record<RiskLevel, number> = {
    critical: 0.95,
    high: 0.85,
    moderate: 0.75,
    minor: 0.65,
    none: 0.4,
};

const RISK_WEIGHT: Record<RiskLevel, number> = {
    critical: 7,
    high: 6,
    moderate: 5,
    minor: 4,
    none: 3,
};

// ─── Mock ML Risk Assignment ──────────────────────────────────────────────────
// Replace assignMockRisk with real ML output once integrated.

const HIGH_RISK_KEYWORDS = ["national highway", "surigao-davao coastal road", "bayugan", "canitlan"];
const MOD_RISK_KEYWORDS = ["poblacion", "lianga", "st. christine"];

function assignMockRisk(wayId: number, name: string): {
    riskLevel: RiskLevel;
    riskScore: number;
    accidentCount: number;
} {
    const n = name.toLowerCase();

    if (HIGH_RISK_KEYWORDS.some((k) => n.includes(k))) {
        const isCritical = wayId % 3 === 0;
        return {
            riskLevel: isCritical ? "critical" : "high",
            riskScore: isCritical ? 75 + (wayId % 20) : 55 + (wayId % 20),
            accidentCount: isCritical ? 8 + (wayId % 7) : 4 + (wayId % 5),
        };
    }

    if (MOD_RISK_KEYWORDS.some((k) => n.includes(k))) {
        return { riskLevel: "moderate", riskScore: 35 + (wayId % 20), accidentCount: 2 + (wayId % 4) };
    }

    const roll = wayId % 10;
    if (roll < 1) return { riskLevel: "critical", riskScore: 80 + (wayId % 15), accidentCount: 9 + (wayId % 6) };
    if (roll < 3) return { riskLevel: "high", riskScore: 55 + (wayId % 20), accidentCount: 4 + (wayId % 5) };
    if (roll < 5) return { riskLevel: "moderate", riskScore: 30 + (wayId % 25), accidentCount: 2 + (wayId % 3) };
    if (roll < 7) return { riskLevel: "minor", riskScore: 10 + (wayId % 20), accidentCount: wayId % 2 };
    return { riskLevel: "none", riskScore: wayId % 10, accidentCount: 0 };
}

// ─── Overpass API ─────────────────────────────────────────────────────────────
// Tries multiple public Overpass mirrors in order; falls through on failure.

const LIANGA_BBOX = "8.55,125.98,8.72,126.18";

const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

async function fetchRoadsFromOSM(): Promise<RoadSegment[]> {
    const query = `
    [out:json][timeout:25];
    way["highway"~"^(primary|secondary|tertiary|residential|unclassified|trunk|road)$"]
      (${LIANGA_BBOX});
    out geom;
  `;

    let lastError: Error = new Error("No endpoints tried");

    for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                body: `data=${encodeURIComponent(query)}`,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status} from ${endpoint}`);

            const json = await res.json();
            const ways: OverpassWay[] = json.elements ?? [];

            return ways
                .filter((w) => w.geometry && w.geometry.length >= 2)
                .map((w) => {
                    const name = w.tags?.name ?? w.tags?.highway ?? "Unnamed Road";
                    const coords: [number, number][] = w.geometry.map((g) => [g.lat, g.lon]);
                    return { id: w.id, coordinates: coords, name, ...assignMockRisk(w.id, name) };
                });

        } catch (err) {
            lastError = err as Error;
            console.warn(`[AccidentRiskRoads] Overpass mirror failed (${endpoint}):`, err);
        }
    }

    throw lastError;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreToRiskLevel(score: number): RiskLevel {
    if (score >= 75) return "critical";
    if (score >= 50) return "high";
    if (score >= 25) return "moderate";
    if (score >= 10) return "minor";
    return "none";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AccidentRiskRoadsProps {
    /**
     * Real ML model output — swap in once your backend is ready.
     * Each item: { wayId: number (OSM way ID), riskScore: number (0-100) }
     */
    mlPredictions?: { wayId: number; riskScore: number }[];

    /** Parent can use this to show/hide a loading spinner */
    onLoadingChange?: (loading: boolean) => void;

    /** Parent can use this to show an error banner */
    onError?: (message: string) => void;
}

export function AccidentRiskRoads({ mlPredictions, onLoadingChange, onError }: AccidentRiskRoadsProps) {
    const [roads, setRoads] = useState<RoadSegment[]>([]);
    const [retryKey, setRetryKey] = useState(0);

    // Expose retry globally so parent's "Retry" button can trigger it
    useEffect(() => {
        (window as unknown as { __retryRoadFetch?: () => void }).__retryRoadFetch = () => setRetryKey((k) => k + 1);
        return () => { delete (window as unknown as { __retryRoadFetch?: () => void }).__retryRoadFetch; };
    }, []);

    useEffect(() => {
        onLoadingChange?.(true);

        fetchRoadsFromOSM()
            .then((fetched) => {
                if (mlPredictions && mlPredictions.length > 0) {
                    const map = new Map(mlPredictions.map((p) => [p.wayId, p.riskScore]));
                    setRoads(
                        fetched.map((road) => {
                            const score = map.get(road.id);
                            return score !== undefined
                                ? { ...road, riskScore: score, riskLevel: scoreToRiskLevel(score) }
                                : road;
                        })
                    );
                } else {
                    setRoads(fetched);
                }
                onLoadingChange?.(false);
            })
            .catch((err: Error) => {
                console.error("[AccidentRiskRoads] All endpoints failed:", err);
                onLoadingChange?.(false);
                onError?.(
                    "Could not load road data — all OpenStreetMap mirrors failed. Check your internet connection and try again."
                );
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mlPredictions, retryKey]);

    return (
        <>
            {roads.map((road) => (
                <Polyline
                    key={road.id}
                    positions={road.coordinates}
                    pathOptions={{
                        color: RISK_COLORS[road.riskLevel],
                        weight: RISK_WEIGHT[road.riskLevel],
                        opacity: RISK_OPACITY[road.riskLevel],
                        lineCap: "round",
                        lineJoin: "round",
                    }}
                >
                    <Tooltip sticky>
                        <div className="text-xs">
                            <div className="font-semibold text-zinc-900 mb-1">{road.name}</div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: RISK_COLORS[road.riskLevel] }}
                                />
                                <span className="font-medium capitalize" style={{ color: RISK_COLORS[road.riskLevel] }}>
                                    {road.riskLevel} Risk
                                </span>
                            </div>
                            <div className="text-zinc-500">Risk Score: {road.riskScore}/100</div>
                            {road.accidentCount > 0 && (
                                <div className="text-zinc-500">Accidents: {road.accidentCount}</div>
                            )}
                        </div>
                    </Tooltip>
                </Polyline>
            ))}
        </>
    );
}