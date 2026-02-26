import { Button } from "@/components/ui/button";
import { useCurrentLocation } from "@/features/maps/hooks/use-current-location";
import { Report } from "@/features/maps/interfaces/get-all-reports-bystander.interface";
import { Clock, Loader2, Navigation, ShieldCheck } from "lucide-react";
import { DateTime } from "luxon";
import { useState } from "react";
import { toast } from "sonner";

const getSeverityColor = (severity: string) => {
    switch (severity) {
        case "critical": return "bg-red-600";
        case "high": return "bg-orange-600";
        case "moderate": return "bg-yellow-500";
        case "minor": return "bg-green-600";
        default: return "bg-gray-500";
    }
};

interface IncidentPopupContentProps {
    dispatch: Report;
    onResolve: () => Promise<void>;
    isResolving: boolean;
}

export function IncidentPopupContent({ dispatch, onResolve, isResolving }: IncidentPopupContentProps) {
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
