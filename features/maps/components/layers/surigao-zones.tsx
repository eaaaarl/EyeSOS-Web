"use client";
import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";

interface MunicipalityAccidentZonesProps {
    reports: Array<{
        latitude: number;
        longitude: number;
        severity: string;
    }>;
}

interface GeoJsonFeature {
    properties: {
        NAME_2: string;
        PROVINCE?: string;
    };
}

interface GeoJsonData {
    features: GeoJsonFeature[];
}

export function MunicipalityAccidentZones({ reports }: MunicipalityAccidentZonesProps) {
    const [geoJsonData, setGeoJsonData] = useState<GeoJsonData | null>(null);
    const [municipalityStats, setMunicipalityStats] = useState<Map<string, any>>(new Map());
    const [loading, setLoading] = useState(true);

    const calculateStats = (geoData: GeoJsonData) => {
        if (!geoData || !geoData.features) return;

        const stats = new Map<string, any>();

        geoData.features.forEach((feature: GeoJsonFeature) => {
            const municipalityName = feature.properties.NAME_2;

            if (!municipalityName) return;

            // Count accidents in this municipality
            const accidentsInArea = reports.filter((report) => {
                try {
                    const point = L.latLng(report.latitude, report.longitude);
                    const tempLayer = L.geoJSON(feature);
                    const bounds = tempLayer.getBounds();
                    return bounds.contains(point);
                } catch (e) {
                    return false;
                }
            });

            const criticalCount = accidentsInArea.filter(r => r.severity?.toLowerCase() === 'critical').length;
            const highCount = accidentsInArea.filter(r => r.severity?.toLowerCase() === 'high').length;
            const moderateCount = accidentsInArea.filter(r => r.severity?.toLowerCase() === 'moderate').length;
            const minorCount = accidentsInArea.filter(r => r.severity?.toLowerCase() === 'minor').length;
            const totalCount = accidentsInArea.length;

            // Determine risk level
            let riskLevel = 'Low Risk';
            let severity = 'low';

            if (criticalCount >= 3 || totalCount >= 8) {
                riskLevel = 'Critical';
                severity = 'critical';
            } else if (criticalCount >= 1 || highCount >= 3 || totalCount >= 5) {
                riskLevel = 'High';
                severity = 'high';
            } else if (highCount >= 1 || moderateCount >= 2 || totalCount >= 3) {
                riskLevel = 'Moderate';
                severity = 'moderate';
            } else if (totalCount > 0) {
                riskLevel = 'Minor';
                severity = 'minor';
            }

            stats.set(municipalityName, {
                totalAccidents: totalCount,
                criticalCount,
                highCount,
                moderateCount,
                minorCount,
                riskLevel,
                severity,
            });
        });

        setMunicipalityStats(stats);
    };

    useEffect(() => {
        const url = '/geojson/surigao-del-sur.json';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setGeoJsonData(data);
                calculateStats(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading GeoJSON:', error);
                setLoading(false);
            });
    }, [reports]); // eslint-disable-line react-hooks/exhaustive-deps



    const getStyle = (feature: GeoJsonFeature) => {
        const municipalityName = feature.properties.NAME_2;
        const stats = municipalityStats.get(municipalityName);
        const severity = stats?.severity || 'low';

        const styles = {
            critical: {
                fillColor: "#dc2626",
                color: "#7f1d1d",
                fillOpacity: 0.4,
                weight: 2.5,
            },
            high: {
                fillColor: "#ea580c",
                color: "#9a3412",
                fillOpacity: 0.35,
                weight: 2,
            },
            moderate: {
                fillColor: "#f59e0b",
                color: "#b45309",
                fillOpacity: 0.3,
                weight: 2,
            },
            minor: {
                fillColor: "#84cc16",
                color: "#4d7c0f",
                fillOpacity: 0.2,
                weight: 1.5,
            },
            low: {
                fillColor: "#e5e7eb",
                color: "#9ca3af",
                fillOpacity: 0.15,
                weight: 1,
            },
        };

        return styles[severity as keyof typeof styles] || styles.low;
    };

    const onEachFeature = (feature: GeoJsonFeature, layer: L.Layer) => {
        const municipalityName = feature.properties.NAME_2;
        const province = feature.properties.PROVINCE;
        const stats = municipalityStats.get(municipalityName);

        if (!municipalityName) return;

        const displayStats = stats || {
            riskLevel: 'No Data',
            totalAccidents: 0,
            criticalCount: 0,
            highCount: 0,
            moderateCount: 0,
            minorCount: 0,
        };

        // Tooltip on hover - SIMPLE, just name and count
        layer.bindTooltip(
            `
      <div style="min-width: 180px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 6px; color: #111827;">
          ${municipalityName}
        </div>
        <div style="font-size: 13px; line-height: 1.6;">
          <div style="display: flex; justify-between; margin: 3px 0;">
            <span style="color: #6b7280;">Risk Level:</span>
            <span style="font-weight: 700; color: ${displayStats.severity === 'critical' ? '#dc2626' :
                displayStats.severity === 'high' ? '#ea580c' :
                    displayStats.severity === 'moderate' ? '#f59e0b' :
                        '#84cc16'
            };">${displayStats.riskLevel}</span>
          </div>
          <div style="display: flex; justify-between; margin: 3px 0;">
            <span style="color: #6b7280;">Accidents:</span>
            <span style="font-weight: 600; color: #111827;">${displayStats.totalAccidents}</span>
          </div>
        </div>
      </div>
    `,
            {
                sticky: true,
                direction: "top",
                offset: [0, -10],
            }
        );

        // Popup on click
        layer.bindPopup(
            `
      <div style="padding: 12px; min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
        <h3 style="font-weight: 800; font-size: 20px; margin-bottom: 12px; color: #111827;">
          ${municipalityName}
        </h3>
        
        <div style="font-size: 14px;">
          <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid ${getStyle(feature).fillColor};">
            <div style="font-weight: 700; color: #374151; margin-bottom: 6px; text-transform: uppercase; font-size: 11px;">Risk Level</div>
            <div style="font-size: 24px; font-weight: 800; color: #111827;">${displayStats.riskLevel}</div>
          </div>
          
          <div style="background-color: #f9fafb; padding: 10px; border-radius: 8px; margin-bottom: 8px;">
            <div style="font-weight: 600; color: #4b5563; margin-bottom: 4px; font-size: 12px;">Total Accidents</div>
            <div style="font-size: 18px; font-weight: 700; color: #111827;">${displayStats.totalAccidents}</div>
            ${displayStats.totalAccidents > 0 ? `
              <div style="font-size: 11px; color: #6b7280; margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                <div>🔴 ${displayStats.criticalCount} Critical</div>
                <div>🟠 ${displayStats.highCount} High</div>
                <div>🟡 ${displayStats.moderateCount} Moderate</div>
                <div>🟢 ${displayStats.minorCount} Minor</div>
              </div>
            ` : ''}
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 10px;">
            <div style="font-size: 11px; color: #9ca3af;">
              Province: ${province || 'Surigao del Sur'}
            </div>
          </div>
        </div>
      </div>
    `,
            {
                maxWidth: 320,
            }
        );

        // Hover effects
        layer.on({
            mouseover: (eKind: L.LeafletMouseEvent) => {
                const layer = eKind.target;
                const currentStyle = getStyle(feature);
                layer.setStyle({
                    fillOpacity: currentStyle.fillOpacity + 0.15,
                    weight: currentStyle.weight + 1,
                });
            },
            mouseout: (eKind: L.LeafletMouseEvent) => {
                const layer = eKind.target;
                layer.setStyle(getStyle(feature));
            },
        });
    };

    if (loading) return null;
    if (!geoJsonData) return null;

    return (
        <GeoJSON
            data={geoJsonData}
            style={getStyle}
            onEachFeature={onEachFeature}
            key={JSON.stringify(municipalityStats)}
        />
    );
}