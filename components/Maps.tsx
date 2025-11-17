"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockAccidents } from "@/data/mockData";
import { createRedNeedleIcon } from "@/features/maps/components/marker";
import { getSeverityColor } from "@/features/maps/utils/severityColor";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

export default function MapComponent() {
  const [icons, setIcons] = useState<Map<number, L.DivIcon>>(new Map());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const iconMap = new Map<number, L.DivIcon>();
    mockAccidents.forEach((accident) => {
      iconMap.set(accident.id, createRedNeedleIcon(accident.severity));
    });
    setTimeout(() => {
      setIcons(iconMap);
    }, 0);

  }, []);

  const openDirections = (lat: number, lng: number, location: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

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
            <Popup maxWidth={320} className="custom-popup">
              <div className="w-[280px] font-sans">
                {accident.severity === "Critical" && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-3 mb-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">🚨</span>
                      <div>
                        <p className="text-sm font-bold text-red-900">URGENT RESPONSE NEEDED</p>
                        <p className="text-xs text-red-700">High priority accident requiring immediate attention</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Road Accident Report
                    </h3>
                    <span className={`${getSeverityColor(accident.severity)} text-white px-2 py-1 rounded-md text-xs font-semibold`}>
                      {accident.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Report ID: #{accident.id} • {accident.time}
                  </p>
                </div>

                {/* Image with rounded corners */}
                <img
                  src={accident.image}
                  alt="Accident scene"
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />

                {/* Description */}
                <div className="mb-3">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {accident.description}
                  </p>
                </div>

                {/* Details */}
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 font-semibold">
                      📍 LOCATION
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      {accident.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">
                      👤 REPORTED BY
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      {accident.reportedBy}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => openDirections(accident.lat, accident.lng, accident.location)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🗺️</span>
                    Get Directions (Google Maps)
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors">
                    View Full Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <nav className="absolute top-4 left-4 right-4 bg-white shadow-lg px-6 py-4 flex items-center justify-between  rounded-xl border border-gray-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 pr-6 border-r border-gray-200">
            <span className="text-xl font-bold">
              <span className="text-red-600">Eye</span>
              <span className="text-blue-600">SOS</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">
                {mockAccidents.length} Active Cases
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-sm font-semibold text-red-700">
                  {mockAccidents.filter(a => a.severity === 'Critical').length}
                </span>
                <span className="text-xs text-red-600">Critical</span>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm font-semibold text-orange-700">
                  {mockAccidents.filter(a => a.severity === 'High').length}
                </span>
                <span className="text-xs text-orange-600">High</span>
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-semibold text-yellow-700">
                  {mockAccidents.filter(a => a.severity === 'Moderate').length}
                </span>
                <span className="text-xs text-yellow-600">Moderate</span>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-sm font-semibold text-green-700">
                  {mockAccidents.filter(a => a.severity === 'Low').length}
                </span>
                <span className="text-xs text-green-600">Low</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Accident Reports</SheetTitle>
            <SheetDescription>
              View all active accident reports and their details
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {mockAccidents.map((accident) => (
              <div key={accident.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">Report #{accident.id}</h4>
                    <p className="text-xs text-gray-500">{accident.time}</p>
                  </div>
                  <span className={`${getSeverityColor(accident.severity)} text-white px-2 py-1 rounded text-xs font-semibold`}>
                    {accident.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{accident.description}</p>
                <div className="text-xs text-gray-600">
                  <p className="mb-1">📍 {accident.location}</p>
                  <p>👤 {accident.reportedBy}</p>
                </div>
                <button
                  onClick={() => {
                    openDirections(accident.lat, accident.lng, accident.location);
                    setIsOpen(false);
                  }}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  View on Map
                </button>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}