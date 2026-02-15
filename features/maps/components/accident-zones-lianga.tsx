"use client";
import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";

interface AccidentZonesProps {
    reports: Array<{
        latitude: number;
        longitude: number;
        severity: string;
        type?: string;
        created_at?: string;
    }>;
}

export function AccidentZones({ reports }: AccidentZonesProps) {
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const [barangayStats, setBarangayStats] = useState<Map<string, any>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = '/geojson/lianga.json';

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
    }, []);

    const calculateStats = (geoData: any) => {
        if (!geoData || !geoData.features) return;

        const stats = new Map();

        geoData.features.forEach((feature: any) => {
            const barangayName = feature.properties.NAME_3;
            const municipality = feature.properties.NAME_2;

            if (!barangayName) return;

            // Count accidents in this barangay
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

            // Determine overall risk level
            let riskLevel = 'Low Risk';
            let severity = 'low';
            let description = 'Minimal accident activity';

            if (criticalCount >= 2 || totalCount >= 5) {
                riskLevel = 'Critical';
                severity = 'critical';
                description = 'Very high accident frequency - immediate attention needed';
            } else if (criticalCount >= 1 || highCount >= 2 || totalCount >= 3) {
                riskLevel = 'High';
                severity = 'high';
                description = 'High accident frequency - requires monitoring';
            } else if (highCount >= 1 || moderateCount >= 2 || totalCount >= 2) {
                riskLevel = 'Moderate';
                severity = 'moderate';
                description = 'Moderate accident activity';
            } else if (totalCount > 0) {
                riskLevel = 'Minor';
                severity = 'minor';
                description = 'Low accident activity';
            }

            stats.set(barangayName, {
                municipality,
                totalAccidents: totalCount,
                criticalCount,
                highCount,
                moderateCount,
                minorCount,
                riskLevel,
                severity,
                description,
                accidents: accidentsInArea,
            });
        });

        setBarangayStats(stats);
    };

    useEffect(() => {
        if (geoJsonData) {
            calculateStats(geoJsonData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reports]);

    const getStyle = (feature: any) => {
        const barangayName = feature.properties.NAME_3;
        const stats = barangayStats.get(barangayName);
        const severity = stats?.severity || 'low';

        const styles = {
            critical: {
                fillColor: "#dc2626",
                color: "#7f1d1d",
                fillOpacity: 0.5,
                weight: 2.5,
            },
            high: {
                fillColor: "#ea580c",
                color: "#9a3412",
                fillOpacity: 0.4,
                weight: 2,
            },
            moderate: {
                fillColor: "#f59e0b",
                color: "#b45309",
                fillOpacity: 0.35,
                weight: 1.5,
            },
            minor: {
                fillColor: "#84cc16",
                color: "#4d7c0f",
                fillOpacity: 0.25,
                weight: 1,
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

    const onEachFeature = (feature: any, layer: any) => {
        const barangayName = feature.properties.NAME_3;
        const municipality = feature.properties.NAME_2;
        const province = feature.properties.PROVINCE;
        const stats = barangayStats.get(barangayName);

        if (!barangayName) return;

        const displayStats = stats || {
            riskLevel: 'No Data',
            totalAccidents: 0,
            description: 'No accidents reported',
            criticalCount: 0,
            highCount: 0,
            moderateCount: 0,
            minorCount: 0,
        };

        // Tooltip on hover
        layer.bindTooltip(
            `
      <div style="min-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px; color: #111827;">
          Barangay ${barangayName}
        </div>
        <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">
          ${municipality}, ${province}
        </div>
        <div style="font-size: 13px; line-height: 1.6;">
          <div style="display: flex; justify-between; margin: 4px 0;">
            <span style="color: #6b7280;">Risk Level:</span>
            <span style="font-weight: 700; color: ${displayStats.severity === 'critical' ? '#dc2626' :
                displayStats.severity === 'high' ? '#ea580c' :
                    displayStats.severity === 'moderate' ? '#f59e0b' :
                        '#84cc16'
            };">${displayStats.riskLevel}</span>
          </div>
          <div style="display: flex; justify-between; margin: 4px 0;">
            <span style="color: #6b7280;">Total Accidents:</span>
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
      <div style="padding: 14px; min-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
        <h3 style="font-weight: 800; font-size: 18px; margin-bottom: 4px; color: #111827;">
          Barangay ${barangayName}
        </h3>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 14px;">
          ${municipality}, ${province}
        </div>
        
        <div style="font-size: 14px;">
          <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid ${getStyle(feature).fillColor};">
            <div style="font-weight: 700; color: #374151; margin-bottom: 6px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Accident Severity</div>
            <div style="font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 4px;">${displayStats.riskLevel}</div>
            <div style="font-size: 11px; color: #6b7280;">${displayStats.description}</div>
          </div>
          
          <div style="background-color: #f9fafb; padding: 10px; border-radius: 8px; margin-bottom: 8px;">
            <div style="font-weight: 600; color: #4b5563; margin-bottom: 6px; font-size: 11px;">Accident Breakdown</div>
            <div style="font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 6px;">${displayStats.totalAccidents} Total Accidents</div>
            ${displayStats.totalAccidents > 0 ? `
              <div style="font-size: 12px; color: #6b7280; margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <div style="width: 8px; height: 8px; background: #dc2626; border-radius: 50%;"></div>
                  <span>${displayStats.criticalCount} Critical</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <div style="width: 8px; height: 8px; background: #ea580c; border-radius: 50%;"></div>
                  <span>${displayStats.highCount} High</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%;"></div>
                  <span>${displayStats.moderateCount} Moderate</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <div style="width: 8px; height: 8px; background: #84cc16; border-radius: 50%;"></div>
                  <span>${displayStats.minorCount} Minor</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `,
            {
                maxWidth: 340,
            }
        );

        // Hover effects
        layer.on({
            mouseover: (e: any) => {
                const layer = e.target;
                const currentStyle = getStyle(feature);
                layer.setStyle({
                    fillOpacity: currentStyle.fillOpacity + 0.2,
                    weight: currentStyle.weight + 1.5,
                });
            },
            mouseout: (e: any) => {
                const layer = e.target;
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
            key={JSON.stringify(barangayStats)}
        />
    );
}