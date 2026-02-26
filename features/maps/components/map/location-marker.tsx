"use client";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useCurrentLocation } from "../../hooks/use-current-location";

export function LocationMarker() {
    const map = useMap();
    const { location } = useCurrentLocation();
    const markerRef = useRef<L.CircleMarker | null>(null);
    const pulseRef = useRef<L.CircleMarker | null>(null);

    useEffect(() => {
        if (!location) return;

        markerRef.current?.remove();
        pulseRef.current?.remove();

        pulseRef.current = L.circleMarker(location, {
            radius: 16,
            color: "#4285F4",
            fillColor: "#4285F4",
            fillOpacity: 0.15,
            weight: 1,
        }).addTo(map);

        markerRef.current = L.circleMarker(location, {
            radius: 7,
            color: "#ffffff",
            fillColor: "#4285F4",
            fillOpacity: 1,
            weight: 2.5,
        }).addTo(map);

        map.flyTo(location, 15, { animate: true, duration: 1.5 });

        return () => {
            markerRef.current?.remove();
            pulseRef.current?.remove();
        };
    }, [location, map]);

    return null;
}