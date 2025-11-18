import { Popup } from "react-leaflet";
import { getSeverityColor } from "@/features/maps/utils/severityColor";

interface Accident {
  id: number;
  lat: number;
  lng: number;
  image: string;
  description: string;
  severity: string;
  location: string;
  reportedBy: string;
  time: string;
}

interface MapPopupProps {
  accident: Accident;
  onGetDirections: (lat: number, lng: number) => void;
}

export function MapPopup({ accident, onGetDirections }: MapPopupProps) {
  return (
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
            onClick={() => onGetDirections(accident.lat, accident.lng)}
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
  );
}

