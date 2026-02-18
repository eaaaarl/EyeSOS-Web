"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDirections } from "../hooks/use-directions";
import { MapPopup } from "./map-popup";
import { MapNavigation } from "./map-navigation";
import { useGetAllReportsBystanderQuery } from "../api/mapApi";
import { ProfileSheet } from "./profile-sheet";
import BottomReports from "./bottom-reports";
import { Loader, EyeOff, Eye, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPinMarkerIcon } from "./marker";
import { AccidentRiskRoads } from "./accident-risk-roads";

export function MapContainerComponent() {
  const { openDirections } = useDirections();
  const [isOpen, setIsOpen] = useState(false);
  const [showRiskRoads, setShowRiskRoads] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  // Road overlay loading/error state (driven by AccidentRiskRoads callbacks)
  const [roadsLoading, setRoadsLoading] = useState(true);
  const [roadsError, setRoadsError] = useState<string | null>(null);

  const { data: allReports, isLoading, isError, refetch } = useGetAllReportsBystanderQuery();
  const reports = allReports?.reports || [];

  // ── Swap this for real ML output once backend is ready ──
  // const { data: mlPredictions } = useGetRiskPredictionsQuery();
  const mlPredictions = undefined;

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
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ── Road risk overlay ── */}
        {showRiskRoads && (
          <AccidentRiskRoads
            mlPredictions={mlPredictions}
            onLoadingChange={(loading) => {
              setRoadsLoading(loading);
              if (loading) setRoadsError(null); // clear old error on retry
            }}
            onError={(msg) => setRoadsError(msg)}
          />
        )}

        {/* ── Individual accident markers ── */}
        {reports.map((report, index) => (
          <Marker
            key={`marker-${index}-${report.id || index}`}
            position={[report.latitude, report.longitude]}
            icon={createPinMarkerIcon(report.severity, 1)}
          >
            <MapPopup accident={report} onGetDirections={openDirections} />
          </Marker>
        ))}
      </MapContainer>

      {/* ── Road risk loading indicator ── */}
      {showRiskRoads && roadsLoading && (
        <div className="absolute top-24 left-4 z-[1000] bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-left duration-300">
          <Loader className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-zinc-900">Loading road risk data…</span>
        </div>
      )}

      {/* ── Road risk error banner ── */}
      {showRiskRoads && roadsError && (
        <div className="absolute top-24 left-4 z-[1000] bg-red-50 border border-red-200 rounded-xl shadow-lg px-4 py-3 max-w-xs animate-in fade-in slide-in-from-left duration-300">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Road data unavailable</p>
              <p className="text-xs text-red-600 mt-0.5">{roadsError}</p>
              <button
                onClick={() => {
                  setRoadsError(null);
                  (window as unknown as { __retryRoadFetch?: () => void }).__retryRoadFetch?.();
                }}
                className="mt-1.5 text-xs font-bold text-red-700 underline hover:text-red-900"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reports loading / error ── */}
      {isLoading && (
        <div className="absolute top-36 left-4 z-[1000] bg-white rounded-xl shadow-lg p-4 max-w-sm animate-in fade-in slide-in-from-left duration-300">
          <div className="flex items-center gap-4">
            <Loader className="w-4 h-4 animate-spin text-red-600" />
            <h3 className="text-sm font-semibold text-zinc-900">Loading emergencies…</h3>
          </div>
        </div>
      )}
      {isError && (
        <div className="absolute top-36 left-4 z-[1000] bg-red-50 rounded-xl shadow-lg p-4 max-w-sm animate-in fade-in slide-in-from-left duration-300">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-zinc-900">Failed to load emergencies</h3>
            <button onClick={() => refetch()} className="text-sm font-semibold text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-100">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* ── Toggle risk road overlay button ── */}
      {!isOpen && (
        <div className="absolute top-18 right-4 z-[1000]">
          <Button
            onClick={() => setShowRiskRoads(!showRiskRoads)}
            className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white flex items-center gap-1.5 rounded-lg shadow-lg"
          >
            {showRiskRoads
              ? <EyeOff className="w-3.5 h-3.5" />
              : <Eye className="w-3.5 h-3.5" />}
            {showRiskRoads ? "Hide" : "Show"} Risk Roads
          </Button>
        </div>
      )}

      {/* ── Toggle legend button ── */}
      {!isOpen && (
        <Button
          onClick={() => setShowLegend(!showLegend)}
          className="absolute top-32 right-4 z-[1000] rounded-lg shadow-lg bg-red-600 hover:bg-red-700 px-3 py-1.5 flex items-center gap-1.5"
        >
          {showLegend
            ? <EyeOff className="w-4 h-4 text-white" />
            : <Eye className="w-4 h-4 text-white" />}
          <span className="text-white text-xs font-semibold">Severity Level</span>
        </Button>
      )}

      {/* ── Legend ── */}
      {!isOpen && showRiskRoads && showLegend && (
        <div className="absolute bottom-24 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 text-xs max-w-[190px]">
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
      )}

      <MapNavigation reports={reports} onMenuClick={() => setIsOpen(true)} />
      <ProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
      <BottomReports reports={reports} onGetDirections={openDirections} />
    </div>
  );
}