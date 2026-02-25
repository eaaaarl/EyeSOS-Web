"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Report } from "../../interfaces/get-all-reports-bystander.interface";

interface MapAutoZoomProps {
    reports: Report[];
}

export function MapAutoZoom({ reports }: MapAutoZoomProps) {
    const map = useMap();

    useEffect(() => {
        if (!reports || reports.length === 0) return;

        // Filter out reports without valid coordinates
        const validReports = reports.filter(
            (r) => r.latitude !== undefined && r.longitude !== undefined
        );

        if (validReports.length === 0) return;

        // Create bounds based on report coordinates
        const bounds = L.latLngBounds(
            validReports.map((r) => [r.latitude, r.longitude])
        );

        if (bounds.isValid()) {
            map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15,
                animate: true,
            });
        }
    }, [reports, map]);

    return null;
}
