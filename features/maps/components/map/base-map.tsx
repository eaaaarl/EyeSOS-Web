"use client";

import { ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapAutoZoom } from "./map-auto-zoom";
import { Report } from "../../interfaces/get-all-reports-bystander.interface";

interface BaseMapProps {
    children?: ReactNode;
    reports?: Report[];
    center?: [number, number];
    zoom?: number;
}

export function BaseMap({
    children,
    reports = [],
    center = [8.6301417, 126.0932737],
    zoom = 12.5
}: BaseMapProps) {
    const philippinesBounds = L.latLngBounds(
        [4.5, 116.0],
        [21.5, 127.0]
    );

    return (
        <div className="h-screen w-screen relative">
            <style>{`
        .leaflet-control-zoom {
          margin-top: 90px !important;
          margin-left: 16px !important;
        }
        .leaflet-control-zoom a { border-radius: 8px !important; }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-control-zoom a:first-child { border-radius: 8px 8px 0 0 !important; }
        .leaflet-control-zoom a:last-child  { border-radius: 0 0 8px 8px !important; }
        .leaflet-tooltip {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          padding: 10px 14px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .leaflet-tooltip-top:before { border-top-color: white; }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>

            <MapContainer
                center={center}
                zoom={zoom}
                className="h-full w-full z-0"
                zoomControl={false}
                maxBounds={philippinesBounds}
                maxBoundsViscosity={1.0}
                minZoom={6}
            >
                <MapAutoZoom reports={reports} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {children}
            </MapContainer>
        </div>
    );
}
