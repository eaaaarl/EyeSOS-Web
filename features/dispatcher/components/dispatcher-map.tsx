"use client";

import { useState } from "react";
import { Marker } from "react-leaflet";
import { BaseMap } from "../../maps/components/map/base-map";
import { MapPopup } from "./map-popup";
import { MapNavigation } from "../../maps/components/map/map-navigation";
import { createPinMarkerIcon } from "../../maps/components/map/marker";
import { useDirections } from "../../maps/hooks/use-directions";
import BottomReports from "../../maps/components/shared/bottom-reports";
import { DispatcherProfileSheet } from "./dispatcher-profile-sheet";
import { useGetAllReportsBystanderQuery, useGetAvailableRespondersQuery } from "../api/dispatcherApi";

export function DispatcherMap() {
    const { openDirections } = useDirections();
    const [isOpen, setIsOpen] = useState(false);

    const { data: allReports } = useGetAllReportsBystanderQuery();
    const { data: availableResponders, isLoading: availableRespondersLoading } = useGetAvailableRespondersQuery();
    const reports = allReports?.reports || [];
    return (
        <>
            <BaseMap reports={reports}>
                {reports.map((report, index) => (
                    <Marker
                        key={`admin-marker-${index}-${report.id || index}`}
                        position={[report.latitude, report.longitude]}
                        icon={createPinMarkerIcon(report.severity, 1)}
                    >
                        <MapPopup
                            availableResponders={availableResponders}
                            isRespondersLoading={availableRespondersLoading}
                            accident={report}
                            onGetDirections={openDirections}
                        />
                    </Marker>
                ))}
            </BaseMap>

            <MapNavigation
                isResponder={false}
                reports={reports}
                onMenuClick={() => setIsOpen(true)}
            />
            <DispatcherProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
            <BottomReports reports={reports} />
        </>
    );
}
