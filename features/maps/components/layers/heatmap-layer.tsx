"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
    reports: Array<{
        latitude: number;
        longitude: number;
        severity: string;
        created_at?: string;
        timestamp?: string;
    }>;
}

declare module "leaflet" {
    function heatLayer(
        latlngs: Array<[number, number, number]>,
        options?: any
    ): any;
}

export function HeatmapLayer({ reports }: HeatmapLayerProps) {
    const map = useMap();

    useEffect(() => {
        if (!reports || reports.length === 0) return;

        const heatData: Array<[number, number, number]> = reports.map((report) => {
            let intensity = 0.3; // default

            const severity = report.severity?.toLowerCase();
            switch (severity) {
                case "critical":
                    intensity = 1.0;
                    break;
                case "high":
                    intensity = 0.8;
                    break;
                case "moderate":
                    intensity = 0.5;
                    break;
                case "minor":
                    intensity = 0.3;
                    break;
                default:
                    intensity = 0.3;
            }

            // Give more weight to recent incidents
            const timestamp = report.created_at || report.timestamp;
            if (timestamp) {
                const incidentDate = new Date(timestamp);
                const now = new Date();
                const daysOld = (now.getTime() - incidentDate.getTime()) / (1000 * 60 * 60 * 24);

                if (daysOld < 30) {
                    intensity = Math.min(1, intensity * 1.3);
                }
            }

            return [report.latitude, report.longitude, intensity];
        });

        const heat = L.heatLayer(heatData, {
            radius: 35,
            blur: 25,
            maxZoom: 17,
            max: 1.0,
            gradient: {
                0.0: "#00ff00",
                0.2: "#84cc16",
                0.4: "#f59e0b",
                0.6: "#ea580c",
                0.8: "#ef4444",
                1.0: "#dc2626",
            },
            minOpacity: 0.4,
        });

        heat.addTo(map);

        return () => {
            map.removeLayer(heat);
        };
    }, [map, reports]);

    return null;
}