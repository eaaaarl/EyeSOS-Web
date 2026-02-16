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
import { Loader, Building2, Home, EyeOff, Eye, X } from "lucide-react";
import { AccidentZones } from "./accident-zones-lianga";
import { MunicipalityAccidentZones } from "./surigao-zones";
import { Button } from "@/components/ui/button";
import { createPinMarkerIcon } from "./marker";

export function MapContainerComponent() {
  const { openDirections } = useDirections();
  const [isOpen, setIsOpen] = useState(false);
  const [showZones, setShowZones] = useState(true);
  const [zoneLevel, setZoneLevel] = useState<'municipality' | 'barangay'>('barangay');
  const [showLegendSeverity, setShowLegendSeverity] = useState(true);
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

        {showZones && /* reports.length > 0 && */ (
          <>
            {zoneLevel === 'municipality' && <MunicipalityAccidentZones reports={reports} />}
            {zoneLevel === 'barangay' && <AccidentZones reports={reports} />}
          </>
        )}

        {reports.map((report, index) => (
          <Marker
            key={`marker-${index}-${report.id || index}`}
            position={[report.latitude, report.longitude]}
            icon={createPinMarkerIcon(report.severity, 1)}
          >
            <MapPopup
              accident={report}
              onGetDirections={openDirections}
            />
          </Marker>
        ))}
      </MapContainer>

      {!isOpen && (
        <div className="absolute top-18 right-4 z-[1000] flex flex-col gap-2">
          <Button
            onClick={() => setShowZones(!showZones)}
            className="bg-white rounded-lg shadow-lg bg-green-600 hover:bg-green-700 transition-colors  text-xs font-semibold text-white hover:text-white transition-colors flex items-center gap-1.5"
          >
            {showZones ? (
              <EyeOff className="w-3.5 h-3.5 text-white" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-white" />
            )}
            <span className="text-white">{showZones ? "Hide" : "Show"} Zones</span>
          </Button>

          {showZones && (
            <div className="bg-white rounded-lg shadow-lg p-1 flex flex-col gap-1">
              <button
                onClick={() => setZoneLevel('municipality')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${zoneLevel === 'municipality'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
              >
                <Building2 className="w-3 h-3" />
                Municipality
              </button>
              <button
                onClick={() => setZoneLevel('barangay')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${zoneLevel === 'barangay'
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
      )}


      {!isOpen && (
        <Button
          onClick={() => setShowLegendSeverity(!showLegendSeverity)}
          className="absolute top-48 right-4 z-[1000] rounded-lg shadow-lg bg-red-600 hover:bg-red-700 transition-colors px-3 py-1.5 flex items-center gap-1.5"
          title={showLegendSeverity ? "Hide legend" : "Show legend"}
        >
          {showLegendSeverity ? (
            <EyeOff className="w-4 h-4 text-white" />
          ) : (
            <Eye className="w-4 h-4 text-white" />
          )}
          <span className="text-white text-xs font-semibold">Severity Level</span>
        </Button>
      )}


      {!isOpen && (showZones && showLegendSeverity) && (
        <div className="absolute bottom-24 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 text-xs max-w-[180px]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-semibold text-zinc-900">
                Severity Level
              </div>
              <div className="text-[10px] font-normal text-zinc-500 mt-0.5">
                ({zoneLevel === 'municipality' ? 'Municipality' : 'Barangay'})
              </div>
            </div>
            <button
              onClick={() => setShowLegendSeverity(false)}
              className="absolute text-zinc-400 hover:text-zinc-600 text-lg leading-none p-1 top-2 right-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-red-600 opacity-50 border border-red-800"></div>
              <span className="text-zinc-700">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-orange-600 opacity-40 border border-orange-800"></div>
              <span className="text-zinc-700">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-yellow-500 opacity-35 border border-yellow-700"></div>
              <span className="text-zinc-700">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-green-500 opacity-25 border border-green-700"></div>
              <span className="text-zinc-700">Minor</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-zinc-200 text-[10px] text-zinc-500">
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