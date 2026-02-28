"use client";

import { useEffect, useRef } from "react";
import { BaseMap } from "../../maps/components/map/base-map";
import { LocationMarker } from "./location-marker";
import { ResponderBottomReports } from "./responder-bottom-reports";
import { useAppSelector } from "@/lib/redux/hooks";
import { useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { toast } from "sonner";
import { IncidentPopupContent } from "@/features/responder/components/incident-popup-content";
import { ChevronLeft } from "lucide-react";
import {
    useGetResponderDispatchQuery,
    useUpdateAccidentResponseStatusMutation,
    useUpdateAccidentStatusMutation,
    useUpdateResponderAvailabilityMutation,
} from "../api/responderApi";
import { LocationButton } from "./location-button";

const incidentIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div class="w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

type DispatchStatus = "accepted" | "resolved" | null;

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 16);
    }, [center, map]);
    return null;
}

interface ResponderMapProps {
    onBack?: () => void;
    onDrawerChange?: (open: boolean) => void;
}

export function ResponderMap({ onBack, onDrawerChange }: ResponderMapProps) {
    const markerRef = useRef<L.Marker>(null);
    const { user } = useAppSelector((state) => state.auth);

    const { data: dispatchData } = useGetResponderDispatchQuery(user?.id || "", {
        skip: !user?.id,
        pollingInterval: 5000,
    });

    const activeDispatch = dispatchData?.accident;

    // Derive status directly from server data — no extra state needed
    const status: DispatchStatus = activeDispatch
        ? dispatchData?.status === "accepted"
            ? "accepted"
            : dispatchData?.status === "resolved"
                ? "resolved"
                : null
        : null;

    const [updateResponderAvailability, { isLoading: isUpdatingAvailability }] = useUpdateResponderAvailabilityMutation();
    const [updateAccidentStatus, { isLoading: isUpdatingAccidentStatus }] = useUpdateAccidentStatusMutation();
    const [updateAccidentResponseStatus, { isLoading: isUpdatingResponseStatus }] = useUpdateAccidentResponseStatusMutation();

    const isMutationLoading = isUpdatingAvailability || isUpdatingAccidentStatus || isUpdatingResponseStatus;

    useEffect(() => {
        if (status === "accepted" && markerRef.current) {
            markerRef.current.openPopup();
        }
    }, [status]);

    const handleResolve = async () => {
        if (!activeDispatch || !user?.id) return;
        try {
            await Promise.all([
                updateAccidentResponseStatus({
                    responderId: user.id,
                    accidentId: activeDispatch.id,
                    status: "resolved",
                }).unwrap(),
                updateAccidentStatus({
                    accidentId: activeDispatch.id,
                    status: "RESOLVED",
                }).unwrap(),
                updateResponderAvailability({
                    responderId: user.id,
                    is_available: true,
                }).unwrap(),
            ]);
        } catch {
            toast.error("Failed to resolve incident. Try again.");
        }
    };

    return (
        <div className="h-full w-full relative">
            <BaseMap>
                <LocationMarker autoRequest={false} />
                {activeDispatch && status === "accepted" && (
                    <>
                        <MapController center={[activeDispatch.latitude, activeDispatch.longitude]} />
                        <Marker
                            position={[activeDispatch.latitude, activeDispatch.longitude]}
                            icon={incidentIcon}
                            ref={markerRef}
                        >
                            <Popup className="incident-popup">
                                <IncidentPopupContent
                                    dispatch={activeDispatch}
                                    onResolve={handleResolve}
                                    isResolving={isMutationLoading}
                                />
                            </Popup>
                        </Marker>
                    </>
                )}
            </BaseMap>


            <button
                onClick={onBack}
                className="absolute top-4 left-4 z-[1000] flex items-center gap-1.5 bg-white shadow-md rounded-full pl-2 pr-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
            >
                <ChevronLeft size={18} />
                Home
            </button>


            <LocationButton isHaveReport={!!(activeDispatch && status === "accepted")} />

            {activeDispatch && status === "accepted" && (
                <ResponderBottomReports report={activeDispatch} onDrawerChange={onDrawerChange} />
            )}
        </div>
    );
}