"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createRedNeedleIcon = (severity: string) => {
  const severityColors = {
    'Critical': '#DC2626',
    'High': '#EA580C',
    'Moderate': '#F59E0B',
    'Low': '#10B981'
  };

  const color = severityColors[severity as keyof typeof severityColors] || '#6B7280';
  const isCritical = severity === 'Critical';

  return L.divIcon({
    className: 'custom-needle-marker',
    html: `
      <div style="position: relative;">
        ${isCritical ? `
          <div style="position: absolute; top: -3px; left: -3px; width: 26px; height: 26px; background: ${color}33; border-radius: 50%; animation: pulse 2s infinite;"></div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.4; }
              50% { transform: scale(1.3); opacity: 0.7; }
            }
          </style>
        ` : ''}
        <svg width="20" height="30" viewBox="0 0 20 30" xmlns="http://www.w3.org/2000/svg">
          <line x1="10" y1="10" x2="10" y2="28" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
          <circle cx="10" cy="8" r="6" fill="${color}"/>
          <circle cx="10" cy="8" r="6" fill="url(#grad)" opacity="0.8"/>
          <ellipse cx="8" cy="6" rx="2" ry="2.5" fill="white" opacity="0.5"/>
          <defs>
            <radialGradient id="grad">
              <stop offset="30%" stop-color="white" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="${color}" stop-opacity="0.9"/>
            </radialGradient>
          </defs>
        </svg>
      </div>
    `,
    iconSize: [20, 30],
    iconAnchor: [10, 28],
    popupAnchor: [0, -28],
  });
};

// Mock road accident data
const mockAccidents = [
  {
    id: 1,
    lat: 8.6301417,
    lng: 126.0932737,
    image: "https://www.panaynews.net/wp-content/uploads/2025/01/reckless-driving-plagues-iloilo-696x419.jpg",
    description: "Two-vehicle collision on main highway. Minor injuries reported. Traffic is partially blocked.",
    severity: "Moderate",
    location: "National Highway, Brgy. San Isidro",
    reportedBy: "Rex Ado",
    time: "2 mins ago"
  },
  {
    id: 2,
    lat: 8.6285,
    lng: 126.0950,
    image: "https://c8.alamy.com/comp/K4417Y/sison-philippines-16-oct-2012-overturned-truck-on-road-in-mindinao-K4417Y.jpg",
    description: "Motorcycle accident near the intersection. Rider needs medical attention immediately.",
    severity: "High",
    location: "Corner Main St. & 5th Ave, Brgy. Poblacion",
    reportedBy: "Marr Ado",
    time: "5 mins ago"
  },
  {
    id: 3,
    lat: 8.6320,
    lng: 126.0915,
    image: "https://www.cdopedia.com/wp-content/uploads/2019/06/1.jpg",
    description: "Single vehicle accident. Car hit the roadside barrier. No injuries reported but vehicle is blocking one lane.",
    severity: "Low",
    location: "Bypass Road, Brgy. Bagong Silang",
    reportedBy: "Marissa Ado",
    time: "8 mins ago"
  },
  {
    id: 4,
    lat: 8.6275,
    lng: 126.0920,
    image: "https://news.az/photos/2025/05/15765-1746094602.jpg",
    description: "Multi-vehicle pileup during heavy rain. Multiple injuries. Emergency services requested.",
    severity: "Critical",
    location: "Coastal Road, Brgy. Seaside",
    reportedBy: "Nel Ado",
    time: "12 mins ago"
  },
  {
    id: 5,
    lat: 8.6310,
    lng: 126.0965,
    image: "https://newsinfo.inquirer.net/files/2024/08/aug21.jpg",
    description: "Truck overturned on the bridge. Cargo spilled on the road. Road is completely blocked.",
    severity: "High",
    location: "Bridge Road, Brgy. Riverside",
    reportedBy: "Earl Ado",
    time: "15 mins ago"
  }
];

// Get severity color
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical": return "bg-red-600";
    case "High": return "bg-orange-600";
    case "Moderate": return "bg-yellow-500";
    case "Low": return "bg-green-600";
    default: return "bg-gray-500";
  }
};

export default function MapComponent() {
  const [icons, setIcons] = useState<Map<number, L.DivIcon>>(new Map());

  useEffect(() => {
    // Create icons for each accident based on severity
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
    <MapContainer
      center={[8.6301417, 126.0932737]}
      zoom={14}
      className="h-full w-full z-0"
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
                <div className="bg-red-50 border-l-4 border-red-600 p-3 mb-3 rounded">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🚨</span>
                    <div>
                      <p className="text-sm font-bold text-red-900">URGENT RESPONSE NEEDED</p>
                      <p className="text-xs text-red-700">High priority accident requiring immediate attention</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Road Accident Report
                  </h3>
                  <span className={`${getSeverityColor(accident.severity)} text-white px-2 py-1 rounded text-xs font-semibold`}>
                    {accident.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Report ID: #{accident.id} • {accident.time}
                </p>
              </div>

              {/* Image */}
              <img
                src={accident.image}
                alt="Accident scene"
                className="w-full h-40 object-cover rounded-lg mb-3"
              />

              {/* Description */}
              <div className="mb-3">
                <p className="text-sm leading-relaxed text-gray-700">
                  {accident.description}
                </p>
              </div>

              {/* Details */}
              <div className="bg-gray-50 p-3 rounded-md mb-3">
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

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => openDirections(accident.lat, accident.lng, accident.location)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>🗺️</span>
                  Get Directions (Google Maps)
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors">
                  View Full Details
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}