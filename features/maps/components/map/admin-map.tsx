"use client";

import { useState } from "react";
import { Marker } from "react-leaflet";
import { BaseMap } from "./base-map";
import { MapPopup } from "./map-popup";
import { MapNavigation } from "./map-navigation";
import { createPinMarkerIcon } from "./marker";
import { useDirections } from "../../hooks/use-directions";
import { useGetAllReportsBystanderQuery, useGetAvailableRespondersQuery } from "../../api/mapApi";
import { AdminProfileSheet } from "../dialogs/admin-profile-sheet";
import BottomReports from "../shared/bottom-reports";

export function AdminMap() {
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
            <AdminProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
            <BottomReports reports={reports} />
        </>
    );
}
