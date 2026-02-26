"use client";

import { useState, useEffect, useRef } from "react";
import { BaseMap } from "../../maps/components/map/base-map";
import { MapNavigation } from "../../maps/components/map/map-navigation";
import { ResponderProfileSheet } from "./responder-profile-sheet";
import { ResponderDispatchAlert } from "./responder-dispatch-alert";
import { LocationMarker } from "./location-marker";
import { LocationButton } from "./location-button";
import BottomReports from "../../maps/components/shared/bottom-reports";
import { useAppSelector } from "@/lib/redux/hooks";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { toast } from "sonner";
import { IncidentPopupContent } from "@/features/responder/components/incident-popup-content";
import { useGetResponderDispatchQuery, useUpdateAccidentResponseStatusMutation, useUpdateAccidentStatusMutation, useUpdateResponderAvailabilityMutation } from "../api/responderApi";

const incidentIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div class="w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

type DispatchStatus = "notified" | "accepted" | "resolved" | null;


export function ResponderMap() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<DispatchStatus>(null);
    const [handledId, setHandledId] = useState<string | null>(null);
    const markerRef = useRef<L.Marker>(null);

    const { user } = useAppSelector((state) => state.auth);
    const { data: dispatchData } = useGetResponderDispatchQuery(user?.id || "", {
        skip: !user?.id,
    });

    const activeDispatch = dispatchData?.accident;

    const [updateResponderAvailability, { isLoading: isUpdatingAvailability }] = useUpdateResponderAvailabilityMutation();
    const [updateAccidentStatus, { isLoading: isUpdatingAccidentStatus }] = useUpdateAccidentStatusMutation();
    const [updateAccidentResponseStatus, { isLoading: isUpdatingResponseStatus }] = useUpdateAccidentResponseStatusMutation();

    const isMutationLoading = isUpdatingAvailability || isUpdatingAccidentStatus || isUpdatingResponseStatus;

    if (activeDispatch && activeDispatch.id !== handledId) {
        setHandledId(activeDispatch.id);
        const mappedStatus =
            dispatchData?.status === 'accepted' ? 'accepted' :
                dispatchData?.status === 'dispatched' ? 'notified' :
                    null;
        setStatus(mappedStatus);
    } else if (!activeDispatch && handledId !== null) {
        setHandledId(null);
        setStatus(null);
    }

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
                    status: 'resolved'
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
            setStatus("resolved");
            toast.success("Incident marked as resolved. Great job!");
            setTimeout(() => {
                setStatus(null);
                setHandledId(null);
            }, 3000);
        } catch {
            toast.error("Failed to resolve incident. Try again.");
        }
    };

    return (
        <div className="h-screen w-screen relative">
            <BaseMap>
                <LocationMarker autoRequest={false} />
                {activeDispatch && status === "accepted" && (
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
                )}
            </BaseMap>

            <LocationButton />

            <MapNavigation
                isResponder={true}
                reports={[]}
                onMenuClick={() => setIsOpen(true)}
            />

            <ResponderProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />

            {(status === "notified" || status === "resolved") && (
                <ResponderDispatchAlert
                    status={status}
                    onStatusChange={setStatus}
                />
            )}

            {activeDispatch && status === "accepted" && (
                <BottomReports reports={[activeDispatch]} isResponder={true} />
            )}
        </div>
    );
}