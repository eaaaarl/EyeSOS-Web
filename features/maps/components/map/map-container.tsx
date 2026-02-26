"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPopup } from "./map-popup";
import { MapNavigation } from "./map-navigation";
import { createPinMarkerIcon } from "./marker";
import { useDirections } from "../../hooks/use-directions";
import { useGetAllReportsBystanderQuery, useGetAvailableRespondersQuery } from "../../api/mapApi";
import { ProfileSheet } from "../dialogs/profile-sheet";
import BottomReports from "../shared/bottom-reports";
import { MapAutoZoom } from "./map-auto-zoom";
import L from "leaflet";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetUserProfileQuery } from "@/features/auth/api/authApi";
import { ResponderDispatchAlert } from "../../../responder/components/responder-dispatch-alert";

export function MapContainerComponent() {
  const { openDirections } = useDirections();
  const [isOpen, setIsOpen] = useState(false);
  // const [showRiskRoads, setShowRiskRoads] = useState(false);
  // const [showLegend, setShowLegend] = useState(false);

  // const [roadsLoading, setRoadsLoading] = useState(true);
  // const [roadsError, setRoadsError] = useState<string | null>(null);

  const { data: allReports } = useGetAllReportsBystanderQuery();
  const { user } = useAppSelector((state) => state.auth);
  const { data: profileData } = useGetUserProfileQuery(
    { user_id: user?.id || "" },
    { skip: !user?.id }
  );
  const { data: availableResponders, isLoading: availableRespondersLoading } = useGetAvailableRespondersQuery();
  const isResponder = profileData?.profile.user_type === "responder";
  const reports = !isResponder ? (allReports?.reports || []) : [];

  // const mlPredictions = undefined;
  const philippinesBounds = L.latLngBounds(
    [4.5, 116.0],
    [21.5, 127.0]
  );
  return (
    <div className="h-screen w-screen relative">
      <style>{`
        .leaflet-control-zoom {
          margin-top: 90px !important;
          margin-left: 16px !important;
        }
        .leaflet-control-zoom a { border-radius: 8px !important; }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-control-zoom a:first-child { border-radius: 8px 8px 0 0 !important; }
        .leaflet-control-zoom a:last-child  { border-radius: 0 0 8px 8px !important; }
        .leaflet-tooltip {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          padding: 10px 14px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .leaflet-tooltip-top:before { border-top-color: white; }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>

      <MapContainer
        center={[8.6301417, 126.0932737]}
        zoom={12.5}
        className="h-full w-full z-0"
        zoomControl={false}
        maxBounds={philippinesBounds}
        maxBoundsViscosity={1.0}
        minZoom={6}
      >
        <MapAutoZoom reports={reports} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/*  {showRiskRoads && (
          <AccidentRiskRoads
            mlPredictions={mlPredictions}
            onLoadingChange={(loading) => {
              setRoadsLoading(loading);
              if (loading) setRoadsError(null);
            }}
            onError={(msg) => setRoadsError(msg)}
          />
        )} */}

        {reports.map((report, index) => (
          <Marker
            key={`marker-${index}-${report.id || index}`}
            position={[report.latitude, report.longitude]}
            icon={createPinMarkerIcon(report.severity, 1)}
          >
            <MapPopup
              availableResponders={availableResponders}
              isRespondersLoading={availableRespondersLoading}
              accident={report}
              onGetDirections={openDirections}
            />
          </Marker>
        ))}
      </MapContainer>

      {/* {((showRiskRoads && (roadsLoading || roadsError)) || isLoading || isError) && (
        <div className="absolute top-16 left-4 z-[1000] flex flex-col gap-1.5 animate-in fade-in slide-in-from-left duration-300">

          {showRiskRoads && roadsLoading && (
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-zinc-200 rounded-lg shadow-md px-3 py-2">
              <Loader className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
              <span className="text-[11px] font-semibold text-zinc-700 whitespace-nowrap">Loading road risks…</span>
            </div>
          )}

          {showRiskRoads && roadsError && (
            <div className="flex items-center gap-2 bg-red-50/95 backdrop-blur-sm border border-red-200 rounded-lg shadow-md px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-[11px] font-semibold text-red-700 whitespace-nowrap">Road data unavailable</span>
              <button
                onClick={() => {
                  setRoadsError(null);
                  (window as unknown as { __retryRoadFetch?: () => void }).__retryRoadFetch?.();
                }}
                className="ml-1 text-[10px] font-bold text-red-600 underline hover:text-red-800 whitespace-nowrap"
              >
                Retry
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-zinc-200 rounded-lg shadow-md px-3 py-2">
              <Loader className="w-3.5 h-3.5 animate-spin text-red-500 shrink-0" />
              <span className="text-[11px] font-semibold text-zinc-700 whitespace-nowrap">Loading emergencies…</span>
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-2 bg-red-50/95 backdrop-blur-sm border border-red-200 rounded-lg shadow-md px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-[11px] font-semibold text-red-700 whitespace-nowrap">Failed to load reports</span>
              <button
                onClick={() => refetch()}
                className="ml-1 text-[10px] font-bold text-red-600 underline hover:text-red-800 whitespace-nowrap"
              >
                Retry
              </button>
            </div>
          )}

        </div>
      )} */}

      {/*   {!isOpen && (
        <div className="absolute top-16 right-4 flex flex-col gap-1">
          <button
            onClick={() => setShowRiskRoads(!showRiskRoads)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-md transition-all whitespace-nowrap"
          >
            {showRiskRoads
              ? <EyeOff className="w-3 h-3 shrink-0" />
              : <Eye className="w-3 h-3 shrink-0" />}
            {showRiskRoads ? "Hide" : "Show"} Risk Roads
          </button>
          {showRiskRoads && (
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-md transition-all whitespace-nowrap"
            >
              {showLegend
                ? <EyeOff className="w-3 h-3 shrink-0" />
                : <Eye className="w-3 h-3 shrink-0" />}
              Severity Level
            </button>
          )}
        </div>
      )} */}

      {/*  {!isOpen && showRiskRoads && showLegend && (
        <div className="absolute bottom-24 left-4 bg-white rounded-lg shadow-lg p-3 text-xs max-w-[190px]">
          <div className="relative flex items-start justify-between mb-2">
            <div>
              <div className="font-semibold text-zinc-900">Road Risk Level</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Forecasted by ML model</div>
            </div>
            <button onClick={() => setShowLegend(false)} className="absolute top-0 right-0 text-zinc-400 hover:text-zinc-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            {[
              { color: "#dc2626", label: "Critical", weight: 7 },
              { color: "#ea580c", label: "High", weight: 6 },
              { color: "#ca8a04", label: "Moderate", weight: 5 },
              { color: "#16a34a", label: "Minor", weight: 4 },
              { color: "#3b82f6", label: "None", weight: 3 },
            ].map(({ color, label, weight }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8">
                  <div className="rounded-full" style={{ backgroundColor: color, height: weight, width: 28 }} />
                </div>
                <span className="text-zinc-700">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-2.5 pt-2 border-t border-zinc-200 text-[10px] text-zinc-500">
            Hover a road to see details
          </div>
        </div>
      )} */}

      <MapNavigation isResponder={isResponder} reports={reports} onMenuClick={() => setIsOpen(true)} />
      <ProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
      {isResponder ? null : <BottomReports reports={reports} />}
      {isResponder && <ResponderDispatchAlert />}
    </div>
  );
}