

import React, { useState } from 'react'
import { BaseMap } from '@/features/maps/components/map/base-map'
import { MapNavigation } from '@/features/maps/components/map/map-navigation'
import { AdminProfileSheet } from './admin-profile-sheet';
import { useGetAllAccidentsQuery } from '../../api/adminApi';
import { Marker } from 'react-leaflet';
import { createPinMarkerIcon } from '@/features/maps/components/map/marker';
import { AdminMapPopup } from './admin-map-popup';
import AdminBottomReports from './admin-bottom-reports';

export function AdminMap() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: accidentsData } = useGetAllAccidentsQuery();
    return (
        <>
            <BaseMap reports={accidentsData?.accidents || []}>
                {accidentsData?.accidents.map((report, index) => (
                    <Marker
                        key={`admin-marker-${index}-${report.id || index}`}
                        position={[report.latitude, report.longitude]}
                        icon={createPinMarkerIcon({ severity: report.severity, count: 1, isAdmin: true })}
                    >
                        <AdminMapPopup accident={report} />
                    </Marker>
                ))}
            </BaseMap>
            <MapNavigation reports={accidentsData?.accidents || []} isResponder={false} isAdmin={true} onMenuClick={() => setIsOpen(true)} />
            <AdminBottomReports reports={accidentsData?.accidents || []} />
            <AdminProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
        </>
    )
}