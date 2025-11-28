"use client";
import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMapIcons } from "../hooks/use-map-icons";
import { useDirections } from "../hooks/use-directions";
import { MapPopup } from "./map-popup";
import { MapNavigation } from "./map-navigation";
import { useGetAllReportsBystanderQuery } from "../api/mapApi";
import { createDotMarkerIcon, groupMarkersByLocation } from "./marker";
import { ReportSheet } from "./report-sheet";

export function MapContainerComponent() {
  const icons = useMapIcons();
  const { openDirections } = useDirections();
  const [isOpen, setIsOpen] = useState(false);

  // Query for to get all the reports send by the bystander
  const { data: allReports } = useGetAllReportsBystanderQuery();

  // Group markers by location to handle overlapping
  const groupedMarkers = useMemo(() => {
    if (!allReports?.reports) return [];
    return groupMarkersByLocation(allReports.reports);
  }, [allReports]);

  const reports = allReports?.reports || []

  if (icons.size === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-100">
        <p className="text-lg text-zinc-600">Loading map...</p>
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
        zoom={14}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {groupedMarkers.map((group, index) => (
          <Marker
            key={`marker-${index}-${group.lat}-${group.lng}`}
            position={[group.lat, group.lng]}
            icon={createDotMarkerIcon(group.severity, group.count)}
          >
            <MapPopup
              accident={group.primaryReport}
              onGetDirections={openDirections}
              additionalReports={group.count > 1 ? group.reports : undefined}
              totalCount={group.count}
            />
          </Marker>
        ))}
      </MapContainer>

      <MapNavigation reports={reports} onMenuClick={() => setIsOpen(true)} />
      <ReportSheet isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}