import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Shield, Truck, MapPin, Ambulance, Loader2, Clock, CheckCircle, Navigation, XCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Report } from "@/features/maps/interfaces/get-all-reports-bystander.interface";
import { toast } from "sonner";
import { formatDistance, getDistanceKm } from "../../maps/utils/haversine";
import { useDispatchResponderMutation, useGetAccidentStatusQuery } from "../../maps/api/mapApi";
import { AvailableResponders } from "../api/inteface";

interface ResponderDispatchDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    report: Report | null;
    availableResponders: AvailableResponders | null;
    isLoading?: boolean;
}


export function ResponderDispatchDialog({
    isOpen,
    onOpenChange,
    report,
    availableResponders,
    isLoading,
}: ResponderDispatchDialogProps) {
    const isMobile = useIsMobile();
    const [isDispatching, setIsDispatching] = useState<string | null>(null);
    const [dispatchedResponderName, setDispatchedResponderName] = useState<string | null>(null);
    const [dispatchResponder, { isLoading: dispatchResponderLoading }] = useDispatchResponderMutation();

    const { data: accidentStatusData } = useGetAccidentStatusQuery(
        { accidentId: report?.id ?? "" },
        { skip: !report?.id || !isOpen }
    );

    const dispatchStatus = accidentStatusData?.responseType === "dispatched" ? "waiting" : accidentStatusData?.responseType === "accepted" ? "accepted" : accidentStatusData?.responseType === "rejected" ? "idle" : "idle";

    useEffect(() => {
        if (accidentStatusData?.responderId) {
            setDispatchedResponderName(accidentStatusData?.responderName)
        }
    }, [accidentStatusData?.responderId, accidentStatusData]);

    if (!report) return null;

    const handleDispatch = async (responderId: string, responderName: string) => {
        setIsDispatching(responderId);
        setDispatchedResponderName(responderName);
        try {
            await dispatchResponder({ accidentId: report.id, responderId }).unwrap();
            toast.info(`Waiting for ${responderName} to accept...`);
        } catch {
            toast.error("Failed to dispatch responder.");
            setIsDispatching(null);
        } finally {
            setIsDispatching(null);
        }
    };

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="max-h-[92vh] rounded-t-[2.5rem] bg-white border-none outline-none shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden font-poppins">
                    <div className="mx-auto mt-4 h-1.5 w-16 shrink-0 rounded-full bg-gray-200 mb-4" />
                    <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-linear-to-r from-blue-50 to-white sticky top-0 z-10">
                        <div>
                            <DrawerHeader className="p-0 text-left">
                                <DrawerTitle className="text-xl font-bold text-gray-900 tracking-tight leading-none mb-1">
                                    Incident Dispatch
                                </DrawerTitle>
                                <DrawerDescription className="text-[10px] uppercase font-bold tracking-widest text-blue-600">
                                    REF: #{report.report_number.toUpperCase()}
                                </DrawerDescription>
                            </DrawerHeader>
                        </div>
                        <div className={`bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tighter shadow-sm`}>
                            COMMANDING
                        </div>
                    </div>
                    <div className="px-6 py-4 overflow-y-auto">
                        <DispatchContent
                            report={report}
                            isDispatching={isDispatching}
                            onDispatch={handleDispatch}
                            availableResponders={availableResponders}
                            isLoading={isLoading}
                            dispatchLoading={dispatchResponderLoading}
                            dispatchStatus={dispatchStatus}
                            dispatchedResponderName={dispatchedResponderName}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-2xl font-poppins">
                <div className="bg-linear-to-r from-blue-50/80 to-white px-6 py-5 flex items-center justify-between border-b border-blue-100/30">
                    <DialogHeader className="p-0 text-left">
                        <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            <div className="w-2 h-6 bg-blue-600 rounded-full" />
                            Dispatch Control
                        </DialogTitle>
                        <DialogDescription className="text-[10px] text-blue-600/70 font-bold uppercase tracking-widest">
                            Incident ID: #{report.report_number.toUpperCase()}
                        </DialogDescription>
                    </DialogHeader>
                    <div className={`bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tighter shadow-sm`}>
                        ACTIVE
                    </div>
                </div>
                <div className="px-4 py-6 overflow-y-auto">
                    <DispatchContent
                        report={report}
                        isDispatching={isDispatching}
                        onDispatch={handleDispatch}
                        availableResponders={availableResponders}
                        isLoading={isLoading}
                        dispatchLoading={dispatchResponderLoading}
                        dispatchStatus={dispatchStatus}
                        dispatchedResponderName={dispatchedResponderName}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface DispatchContentProps {
    report: Report;
    isDispatching: string | null;
    onDispatch: (id: string, name: string) => void;
    availableResponders: AvailableResponders | null;
    isLoading?: boolean;
    dispatchLoading?: boolean;
    dispatchStatus: "idle" | "waiting" | "accepted" | "rejected"; // add this
    dispatchedResponderName: string | null;                        // add this
}

const DispatchContent = ({
    report, isDispatching, onDispatch, availableResponders,
    isLoading, dispatchLoading, dispatchStatus, dispatchedResponderName
}: DispatchContentProps) => (
    <div className="space-y-4 px-1 pb-6 font-poppins">
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none mb-1.5">
                    Incident Location
                </p>
                <p className="text-[13px] font-bold text-slate-700 truncate leading-tight">
                    {report.location_address}
                </p>
                {report.landmark && (
                    <p className="text-[11px] font-semibold text-red-600 mt-0.5">Near {report.landmark}</p>
                )}
            </div>
        </div>

        <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 shadow-sm">
            <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-tighter">
                            Dispatch Command
                        </h3>
                        <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest leading-none">
                            Select Response Unit
                        </p>
                    </div>
                </div>
                {dispatchStatus === "idle" && (
                    <div className="px-2 py-1 bg-white rounded-md border border-blue-200 shadow-xs">
                        <span className="text-[10px] font-bold text-blue-700 leading-none">
                            {availableResponders?.responders.length} ONLINE
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar pr-0.5 min-h-[100px] flex flex-col">
                {dispatchStatus === "waiting" && (
                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                        <div className="relative w-16 h-16">
                            <div className="w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-bold text-slate-800">Waiting for Response</p>
                            <p className="text-xs text-slate-500">
                                <span className="font-semibold text-blue-600">{dispatchedResponderName}</span> has been notified
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                            <Clock className="w-3 h-3 text-blue-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Pending Acceptance</span>
                        </div>
                    </div>
                )}

                {dispatchStatus === "accepted" && (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-bold text-green-700">Dispatch Accepted!</p>
                            <p className="text-xs text-slate-500">
                                <span className="font-semibold">{dispatchedResponderName}</span> is en route
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                            <Navigation className="w-3 h-3 text-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">En Route to Incident</span>
                        </div>
                    </div>
                )}

                {dispatchStatus === "rejected" && (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-bold text-red-700">Dispatch Rejected</p>
                            <p className="text-xs text-slate-500">
                                <span className="font-semibold">{dispatchedResponderName}</span> is unavailable
                            </p>
                        </div>
                        <p className="text-[10px] text-slate-400">Selecting another responder...</p>
                    </div>
                )}

                {dispatchStatus === "idle" && (
                    <>
                        {isLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-8 gap-3">
                                <div className="relative">
                                    <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
                                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                                    Searching Responders...
                                </p>
                            </div>
                        ) : availableResponders?.responders.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-8 gap-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                <Truck className="w-6 h-6 text-slate-300" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">
                                    No Responders Online
                                </p>
                            </div>
                        ) : (
                            availableResponders?.responders.map((resp) => {
                                const distance = resp.latitude && resp.longitude
                                    ? formatDistance(getDistanceKm(resp.latitude, resp.longitude, report.latitude, report.longitude))
                                    : null;

                                return (
                                    <div key={resp.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 group transition-all hover:border-blue-300 hover:shadow-md hover:shadow-blue-50/50">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-blue-50 transition-colors">
                                                <Ambulance className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-bold text-gray-900 truncate tracking-tight">{resp.profiles.name}</span>
                                                {distance ? (
                                                    <span className="text-[10px] font-semibold text-blue-500">{distance}</span>
                                                ) : (
                                                    <span className="text-[10px] font-semibold text-slate-400">Location unavailable</span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            disabled={isDispatching !== null}
                                            onClick={() => onDispatch(resp.profiles.id, resp.profiles.name)}
                                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tight transition-all active:scale-95 shadow-xs ${isDispatching === resp.id
                                                ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
                                                }`}
                                        >
                                            {(dispatchLoading || isDispatching === resp.id)
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : "Dispatch"}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </>
                )}
            </div>
        </div>
    </div>
);