import { Popup } from "react-leaflet";
import { getSeverityColor } from "@/features/maps/utils/severityColor";
import { Report } from "../interface/get-all-reports-bystander.interface";
import { useState } from "react";

interface MapPopupProps {
  accident: Report;
  onGetDirections: (lat: number, lng: number) => void;
  additionalReports?: Report[];
  totalCount?: number;
}

export function MapPopup({ 
  accident, 
  onGetDirections, 
  additionalReports,
  totalCount = 1 
}: MapPopupProps) {
  const [selectedReport, setSelectedReport] = useState<Report>(accident);
  const hasMultipleReports = totalCount > 1 && additionalReports;

  return (
    <Popup maxWidth={320} className="custom-popup">
      <div className="w-[280px] font-sans">
        {/* Multiple Reports Alert */}
        {hasMultipleReports && (
          <div className="bg-orange-50 border-l-4 border-orange-600 p-3 mb-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-2">⚠️</span>
              <div>
                <p className="text-sm font-bold text-orange-900">
                  {totalCount} REPORTS AT THIS LOCATION
                </p>
                <p className="text-xs text-orange-700">
                  Multiple bystanders reported this incident
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Critical Alert */}
        {selectedReport.severity === "Critical" && (
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

        {/* Report Selector */}
        {hasMultipleReports && (
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              SELECT REPORT TO VIEW:
            </label>
            <select
              value={selectedReport.id}
              onChange={(e) => {
                const report = additionalReports.find(r => r.id === Number(e.target.value));
                if (report) setSelectedReport(report);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {additionalReports.map((report, idx) => (
                <option key={report.id} value={report.id}>
                  Report #{idx + 1} - {report.severity} - {new Date(report.created_at).toLocaleTimeString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Header */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Road Accident Report
            </h3>
            <span className={`${getSeverityColor(selectedReport.severity)} text-white px-2 py-1 rounded-md text-xs font-semibold`}>
              {selectedReport.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Report ID: #{selectedReport.report_number} • {selectedReport.created_at}
          </p>
        </div>

        {/* Image */}
        <img
          src={selectedReport.imageUrl}
          alt="Accident scene"
          className="w-full h-40 object-cover rounded-xl mb-3"
        />

        {/* Description */}
        <div className="mb-3">
          <p className="text-sm leading-relaxed text-gray-700">
            {selectedReport.reporter_notes}
          </p>
        </div>

        {/* Details */}
        <div className="bg-gray-50 p-3 rounded-lg mb-3">
          <div className="mb-2">
            <p className="text-xs text-gray-600 font-semibold">
              📍 LOCATION
            </p>
            <p className="text-sm text-gray-900 mt-1">
              {selectedReport.location_address}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">
              👤 REPORTED BY
            </p>
            <p className="text-sm text-gray-900 mt-1">
              {selectedReport.reporter_name}
            </p>
          </div>
        </div>

        {/* Show all reports summary if multiple */}
        {hasMultipleReports && (
          <div className="bg-blue-50 p-3 rounded-lg mb-3">
            <p className="text-xs font-semibold text-blue-900 mb-2">
              📋 ALL REPORTS SUMMARY:
            </p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {additionalReports.map((report, idx) => (
                <div 
                  key={report.id} 
                  className={`text-xs p-2 rounded cursor-pointer transition-colors ${
                    selectedReport.id === report.id 
                      ? 'bg-blue-200 border border-blue-400' 
                      : 'bg-white border border-blue-200 hover:bg-blue-100'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <span className="font-semibold">#{idx + 1}</span> - {report.severity} - {report.reporter_name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onGetDirections(selectedReport.latitude, selectedReport.longitude)}
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