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
import { Loader } from "lucide-react";

export function MapContainerComponent() {
  const { openDirections } = useDirections();
  const [isOpen, setIsOpen] = useState(false);

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
      `}</style>

      <MapContainer
        center={[8.6301417, 126.0932737]}
        zoom={11}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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


      {isLoading && (
        <div className="absolute top-17 left-4 z-[1000] bg-white rounded-xl shadow-lg p-4 max-w-sm animate-in fade-in slide-in-from-left duration-300">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Loader className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Loading emergencies...</h3>
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div className="absolute top-17 left-4 z-[1000] bg-red-50 rounded-xl shadow-lg p-4 max-w-sm animate-in fade-in slide-in-from-left duration-300">
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