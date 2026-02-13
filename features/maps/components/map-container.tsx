"use client";
import Image from "next/image";
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

export function MapContainerComponent() {
  const { openDirections } = useDirections();
  const [isOpen, setIsOpen] = useState(false);

  const { data: allReports, isLoading, isError } = useGetAllReportsBystanderQuery();

  const reports = allReports?.reports || [];

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="relative h-full w-full">
          <Image
            src="/logo.png"
            alt="EyeSOS logo"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-100">
        <p className="text-lg text-red-600">Error loading map data. Please try again.</p>
      </div>
    );
  }

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

      <MapNavigation reports={reports} onMenuClick={() => setIsOpen(true)} />
      <ProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
      <BottomReports reports={reports} onGetDirections={openDirections} />
    </div>
  );
}