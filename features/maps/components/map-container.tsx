"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { mockAccidents } from "@/data/mockData";
import { useMapIcons } from "../hooks/use-map-icons";
import { useDirections } from "../hooks/use-directions";
import { MapPopup } from "./map-popup";
import { MapNavigation } from "./map-navigation";
import { UserProfileSheet } from "./user-profile-sheet";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetUserProfileQuery } from "@/features/auth/api/authApi";
import { skipToken } from "@reduxjs/toolkit/query";

export function MapContainerComponent() {
  const auth = useAppSelector((state) => state.auth)
  const icons = useMapIcons();
  const { openDirections } = useDirections();
  const [isOpen, setIsOpen] = useState(false);
  const userId = auth.user?.id;
  const { data: profile } = useGetUserProfileQuery(
    userId ? { user_id: userId } : skipToken
  );

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

        {mockAccidents.map((accident) => (
          <Marker
            key={accident.id}
            position={[accident.lat, accident.lng]}
            icon={icons.get(accident.id)!}
          >
            <MapPopup accident={accident} onGetDirections={openDirections} />
          </Marker>
        ))}
      </MapContainer>

      <MapNavigation onMenuClick={() => setIsOpen(true)} />
      <UserProfileSheet profile={profile} isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}

