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
import { useGetAllReportsBystanderQuery, useGetResponderTeamsQuery } from "../api/dispatcherApi";

export function DispatcherMap() {
    const { openDirections } = useDirections();
    const [isOpen, setIsOpen] = useState(false);

    const { data: allReports } = useGetAllReportsBystanderQuery();
    const reports = allReports?.reports || [];

    // get responder teams
    const { data: responderTeam, isLoading: responderTeamLoading } = useGetResponderTeamsQuery();
    return (
        <>
            <BaseMap reports={reports}>
                {reports.map((report, index) => {
                    const isDispatched = report.accident_responses?.some(
                        (resp) => resp.response_type === "dispatched" || resp.response_type === "accepted"
                    );
                    return (
                        <Marker
                            key={`admin-marker-${index}-${report.id || index}`}
                            position={[report.latitude, report.longitude]}
                            icon={createPinMarkerIcon({
                                severity: report.severity,
                                count: 1,
                                isDispatched
                            })}
                        >
                            <MapPopup
                                responderTeam={responderTeam}
                                responderTeamLoading={responderTeamLoading}
                                accident={report}
                                onGetDirections={openDirections}
                                isDispatched={isDispatched}
                            />
                        </Marker>
                    );
                })}
            </BaseMap>

            <MapNavigation
                isResponder={false}
                reports={reports}
                onMenuClick={() => setIsOpen(true)}
                isAdmin={false}
            />
            <DispatcherProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
            <BottomReports reports={reports} />
        </>
    );
}
