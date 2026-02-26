"use client";
import { useState, useEffect, useRef } from "react";
import { BaseMap } from "./base-map";
import { MapNavigation } from "./map-navigation";
import { ResponderProfileSheet } from "../dialogs/responder-profile-sheet";
import { ResponderDispatchAlert } from "./responder-dispatch-alert";
import { LocationMarker } from "./location-marker";
import { LocationButton } from "./location-button";
import BottomReports from "../shared/bottom-reports";
import { useAppSelector } from "@/lib/redux/hooks";
import {
    useGetResponderDispatchQuery,
    useUpdateAccidentResponseStatusMutation,
    useUpdateAccidentStatusMutation,
    useUpdateResponderAvailabilityMutation,
} from "../../api/mapApi";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { DateTime } from "luxon";
import { getSeverityColor } from "../../utils/severityColor";
import { Button } from "@/components/ui/button";
import { Navigation, ShieldCheck, Clock, Loader2 } from "lucide-react";
import { useCurrentLocation } from "../../hooks/use-current-location";
import { toast } from "sonner";
import { Report } from "../../interfaces/get-all-reports-bystander.interface";

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

interface IncidentPopupContentProps {
    dispatch: Report;
    onResolve: () => Promise<void>;
    isResolving: boolean;
}

function IncidentPopupContent({ dispatch, onResolve, isResolving }: IncidentPopupContentProps) {
    const { getCurrentLocation, isLoading: isFetchingLocation } = useCurrentLocation();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleNavigate = async () => {
        if (!dispatch?.latitude || !dispatch?.longitude) return;
        setIsNavigating(true);
        const win = window.open("", "_blank");
        if (!win) {
            setIsNavigating(false);
            toast.error("Popup blocked. Please allow popups for this site.");
            return;
        }
        try {
            const location = await getCurrentLocation();
            const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${dispatch.latitude},${dispatch.longitude}&travelmode=driving`;
            win.location.href = url;
        } catch (error) {
            console.error("Failed to get current location:", error);
            win.location.href = `https://www.google.com/maps/dir/?api=1&destination=${dispatch.latitude},${dispatch.longitude}&travelmode=driving`;
        } finally {
            setIsNavigating(false);
        }
    };

    return (
        <div className="w-[220px] p-2 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Emergency Incident</span>
                <span className={`${getSeverityColor(dispatch.severity)} text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase`}>
                    {dispatch.severity}
                </span>
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-900 leading-tight">
                    {dispatch.location_address}
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Reported {DateTime.fromISO(dispatch.created_at).toRelative()}</span>
                </div>
            </div>

            {dispatch.reporter_notes && (
                <p className="text-[10px] text-gray-500 italic bg-gray-50 p-2 rounded border-l-2 border-gray-200">
                    &quot;{dispatch.reporter_notes}&quot;
                </p>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <Button
                    size="sm"
                    onClick={handleNavigate}
                    disabled={isNavigating || isFetchingLocation || isResolving}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-9 text-[11px] font-bold"
                >
                    {(isNavigating || isFetchingLocation) ? (
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    ) : (
                        <Navigation className="w-3.5 h-3.5 mr-2" />
                    )}
                    NAVIGATE TO LOCATION
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={onResolve}
                    disabled={isResolving || isNavigating || isFetchingLocation}
                    className="w-full border-zinc-200 hover:bg-zinc-50 h-9 text-[11px] font-bold"
                >
                    {isResolving ? (
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    ) : (
                        <ShieldCheck className="w-3.5 h-3.5 mr-2 text-green-600" />
                    )}
                    MARK AS RESOLVED
                </Button>
            </div>
        </div>
    );
}

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

    // Synchronize local status with incoming dispatch during rendering
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