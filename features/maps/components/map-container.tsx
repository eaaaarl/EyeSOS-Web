"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDirections } from "../hooks/use-directions";
import { MapPopup } from "./map-popup";
import { MapNavigation } from "./map-navigation";
import { useGetAllReportsBystanderQuery } from "../api/mapApi";
import { createDotMarkerIcon } from "./marker";
import { ProfileSheet } from "./profile-sheet";
import BottomReports from "./bottom-reports";
import { Loader, MapIcon, Building2, Home } from "lucide-react";
import { AccidentZones } from "./accident-zones-lianga";
import { MunicipalityAccidentZones } from "./surigao-zones";
import { mockAccidentData } from "@/constant/mockData";

export function MapContainerComponent() {
  const { openDirections } = useDirections();
  const [isOpen, setIsOpen] = useState(false);
  const [showZones, setShowZones] = useState(true);
  const [zoneLevel, setZoneLevel] = useState<'municipality' | 'barangay'>('barangay');
  const { data: allReports, isLoading, isError, refetch } = useGetAllReportsBystanderQuery();
  const reports = allReports?.reports || [];

  return (
    <div className="h-screen w-screen relative">
      <style>{`
        .leaflet-control-zoom {
          margin-top: 90px !important;
          margin-left: 16px !important;
        }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-control-zoom a:first-child {
          border-radius: 8px 8px 0 0 !important;
        }
        .leaflet-control-zoom a:last-child {
          border-radius: 0 0 8px 8px !important;
        }
        
        .leaflet-tooltip {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          padding: 10px 14px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .leaflet-tooltip-top:before {
          border-top-color: white;
        }
        
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

        {showZones && reports.length > 0 && (
          <>
            {zoneLevel === 'municipality' && <MunicipalityAccidentZones reports={reports} />}
            {zoneLevel === 'barangay' && <AccidentZones reports={mockAccidentData} />}
          </>
        )}

        {reports.map((report, index) => (
          <Marker
            key={`marker-${index}-${report.id || index}`}
            position={[report.latitude, report.longitude]}
            icon={createDotMarkerIcon(report.severity, 1)}
          >
            <MapPopup
              accident={report}
              onGetDirections={openDirections}
            />
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-24 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setShowZones(!showZones)}
          className="bg-white rounded-lg shadow-lg px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors flex items-center gap-2"
        >
          <MapIcon className="w-4 h-4" />
          {showZones ? "Hide" : "Show"} Zones
        </button>

        {showZones && (
          <div className="bg-white rounded-lg shadow-lg p-2 flex gap-1">
            <button
              onClick={() => setZoneLevel('municipality')}
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${zoneLevel === 'municipality'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-700 hover:bg-zinc-100'
                }`}
            >
              <Building2 className="w-3 h-3" />
              Municipality
            </button>
            <button
              onClick={() => setZoneLevel('barangay')}
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${zoneLevel === 'barangay'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-700 hover:bg-zinc-100'
                }`}
            >
              <Home className="w-3 h-3" />
              Barangay
            </button>
          </div>
        )}
      </div>

      {showZones && (
        <div className="absolute bottom-24 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 text-sm max-w-[200px]">
          <div className="font-semibold mb-2 text-zinc-900">
            Severity Level
            <div className="text-xs font-normal text-zinc-500 mt-1">
              ({zoneLevel === 'municipality' ? 'Municipality' : 'Barangay'} Level)
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-600 opacity-50 border border-red-800"></div>
              <span className="text-zinc-700 text-xs">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-600 opacity-40 border border-orange-800"></div>
              <span className="text-zinc-700 text-xs">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500 opacity-35 border border-yellow-700"></div>
              <span className="text-zinc-700 text-xs">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500 opacity-25 border border-green-700"></div>
              <span className="text-zinc-700 text-xs">Minor</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-200 text-xs text-zinc-500">
            Most accidents area
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute top-24 left-4 z-[1000] bg-white rounded-xl shadow-lg p-4 max-w-sm animate-in fade-in slide-in-from-left duration-300">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Loader className="w-4 h-4 animate-spin text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Loading emergencies...</h3>
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div className="absolute top-24 left-4 z-[1000] bg-red-50 rounded-xl shadow-lg p-4 max-w-sm animate-in fade-in slide-in-from-left duration-300">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-zinc-900">Failed to load emergencies</h3>
            <button onClick={() => refetch()} className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors px-3 py-1 rounded-lg hover:bg-red-100">
              Retry
            </button>
          </div>
        </div>
      )}

      <MapNavigation reports={reports} onMenuClick={() => setIsOpen(true)} />
      <ProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
      <BottomReports reports={reports} onGetDirections={openDirections} />
    </div>
  );
}