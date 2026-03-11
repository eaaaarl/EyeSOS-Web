import React, { useState } from 'react'
import { BaseMap } from '@/features/maps/components/map/base-map'
import { MapNavigation } from '@/features/maps/components/map/map-navigation'
import { AdminProfileSheet } from './admin-profile-sheet';
import { useGetAllAccidentsQuery } from '../../api/adminApi';
import { Marker } from 'react-leaflet';
import { createPinMarkerIcon } from '@/features/maps/components/map/marker';
import { AdminMapPopup } from './admin-map-popup';
import AdminBottomReports from './admin-bottom-reports';
import { Eye, EyeOff } from 'lucide-react';

const SEVERITY_LEVELS = [
    { key: 'Critical', bg: 'bg-red-600', hoverBg: 'hover:bg-red-700' },
    { key: 'High', bg: 'bg-orange-500', hoverBg: 'hover:bg-orange-600' },
    { key: 'Moderate', bg: 'bg-yellow-500', hoverBg: 'hover:bg-yellow-600' },
    { key: 'Minor', bg: 'bg-green-600', hoverBg: 'hover:bg-green-700' },
];

const STATUS_LEVELS = [
    { key: 'NEW', bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700' },
    { key: 'VERIFIED', bg: 'bg-cyan-600', hoverBg: 'hover:bg-cyan-700' },
    { key: 'IN_PROGRESS', bg: 'bg-amber-600', hoverBg: 'hover:bg-amber-700' },
    { key: 'PENDING', bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-700' },
    { key: 'RESOLVED', bg: 'bg-emerald-600', hoverBg: 'hover:bg-emerald-700' },
    { key: 'CLOSED', bg: 'bg-gray-600', hoverBg: 'hover:bg-gray-700' },
];


export function AdminMap() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSeverities, setActiveSeverities] = useState(
        new Set(['Critical', 'High', 'Moderate', 'Minor'])
    );
    const [activeStatuses, setActiveStatuses] = useState(
        new Set(['NEW', 'VERIFIED', 'IN_PROGRESS', 'PENDING', 'RESOLVED'])
    );

    const { data: accidentsData } = useGetAllAccidentsQuery();

    const toggleSeverity = (key: string) => {
        setActiveSeverities(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const toggleStatus = (key: string) => {
        setActiveStatuses(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const filteredAccidents = (accidentsData?.accidents || []).filter(r => {
        const severityMatch = activeSeverities.has(
            r.severity.charAt(0).toUpperCase() + r.severity.slice(1).toLowerCase()
        );
        const statusMatch = activeStatuses.has(r.accident_status);
        return severityMatch && statusMatch;
    });

    return (
        <>
            <BaseMap reports={filteredAccidents}>
                {filteredAccidents.map((report, index) => (
                    <Marker
                        key={`admin-marker-${index}-${report.id || index}`}
                        position={[report.latitude, report.longitude]}
                        icon={createPinMarkerIcon({ severity: report.severity, count: 1, isAdmin: true })}
                    >
                        <AdminMapPopup accident={report} />
                    </Marker>
                ))}
            </BaseMap>

            <MapNavigation
                reports={filteredAccidents}
                isResponder={false}
                isAdmin={true}
                onMenuClick={() => setIsOpen(true)}
            />

            <div className="absolute top-20 right-3 flex flex-col gap-4 pointer-events-none">
                <div className="flex flex-col gap-1 pointer-events-auto">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">Severity</p>
                    {SEVERITY_LEVELS.map(({ key, bg, hoverBg }) => {
                        const active = activeSeverities.has(key);
                        return (
                            <button
                                key={key}
                                onClick={() => toggleSeverity(key)}
                                className={`
                                    flex items-center gap-1.5 pl-2 pr-2 py-1 rounded-md
                                    text-white text-[10px] font-medium shadow-sm
                                    transition-all duration-150 select-none
                                    ${active ? `${bg} ${hoverBg}` : 'bg-gray-400/80 hover:bg-gray-500'}
                                `}
                            >
                                {active ? <Eye className='w-3 h-3' /> : <EyeOff className='w-3 h-3' />}
                                {key}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-1 pointer-events-auto">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">Status</p>
                    {STATUS_LEVELS.map(({ key, bg, hoverBg }) => {
                        const active = activeStatuses.has(key);
                        return (
                            <button
                                key={key}
                                onClick={() => toggleStatus(key)}
                                className={`
                                    flex items-center gap-1.5 pl-2 pr-2 py-1 rounded-md
                                    text-white text-[10px] font-medium shadow-sm
                                    transition-all duration-150 select-none
                                    ${active ? `${bg} ${hoverBg}` : 'bg-gray-400/80 hover:bg-gray-500'}
                                `}
                            >
                                {active ? <Eye className='w-3 h-3' /> : <EyeOff className='w-3 h-3' />}
                                {key.replace('_', ' ')}
                            </button>
                        );
                    })}
                </div>
            </div>

            <AdminBottomReports reports={filteredAccidents} />
            <AdminProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
        </>
    );
}