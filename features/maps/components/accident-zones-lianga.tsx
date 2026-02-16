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
    timestamp?: string;
    source?: 'bystander' | 'mdrrmc';
  }>;
}

interface BarangayStats {
  municipality: string;
  totalAccidents: number;
  criticalCount: number;
  highCount: number;
  moderateCount: number;
  minorCount: number;
  bystanderReports: number;
  mdrrmcReports: number;
  recentIncidents: number; // Last 30 days
  riskLevel: string;
  severity: string;
  description: string;
  riskScore: number;
  accidents: any[];
  accidentTypes: { [key: string]: number };
}

export function AccidentZones({ reports }: AccidentZonesProps) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [barangayStats, setBarangayStats] = useState<Map<string, BarangayStats>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = "/geojson/lianga.json";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data);
        calculateStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
        setLoading(false);
      });
  }, []);

  const calculateStats = (geoData: any) => {
    if (!geoData || !geoData.features) return;

    const stats = new Map<string, BarangayStats>();
    const now = new Date();

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

      // Count by severity
      const criticalCount = accidentsInArea.filter(
        (r) => r.severity?.toLowerCase() === "critical"
      ).length;
      const highCount = accidentsInArea.filter(
        (r) => r.severity?.toLowerCase() === "high"
      ).length;
      const moderateCount = accidentsInArea.filter(
        (r) => r.severity?.toLowerCase() === "moderate"
      ).length;
      const minorCount = accidentsInArea.filter(
        (r) => r.severity?.toLowerCase() === "minor"
      ).length;
      const totalCount = accidentsInArea.length;

      // Count by source
      const bystanderReports = accidentsInArea.filter(
        (r) => r.source === "bystander"
      ).length;
      const mdrrmcReports = accidentsInArea.filter(
        (r) => r.source === "mdrrmc" || !r.source
      ).length;

      // Count recent incidents (last 30 days)
      const recentIncidents = accidentsInArea.filter((r) => {
        const timestamp = r.created_at || r.timestamp;
        if (!timestamp) return false;
        const incidentDate = new Date(timestamp);
        const daysOld = (now.getTime() - incidentDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysOld <= 30;
      }).length;

      // Count by accident type
      const accidentTypes: { [key: string]: number } = {};
      accidentsInArea.forEach((r) => {
        const type = r.type || "Unknown";
        accidentTypes[type] = (accidentTypes[type] || 0) + 1;
      });

      // Calculate risk score (0-100)
      let riskScore = 0;
      riskScore += criticalCount * 25; // Critical incidents heavily weighted
      riskScore += highCount * 15;
      riskScore += moderateCount * 8;
      riskScore += minorCount * 3;
      riskScore += recentIncidents * 5; // Recent activity increases risk

      // Cap at 100
      riskScore = Math.min(100, riskScore);

      // Determine overall risk level based on score and thresholds
      let riskLevel = "Low Risk";
      let severity = "low";
      let description = "Minimal accident activity";

      if (riskScore >= 75 || criticalCount >= 3 || totalCount >= 8) {
        riskLevel = "Critical";
        severity = "critical";
        description = "Very high accident frequency - immediate intervention required";
      } else if (riskScore >= 50 || criticalCount >= 2 || totalCount >= 5) {
        riskLevel = "High";
        severity = "high";
        description = "High accident frequency - enhanced monitoring recommended";
      } else if (riskScore >= 25 || highCount >= 2 || totalCount >= 3) {
        riskLevel = "Moderate";
        severity = "moderate";
        description = "Moderate accident activity - regular monitoring advised";
      } else if (totalCount > 0) {
        riskLevel = "Minor";
        severity = "minor";
        description = "Low accident activity - maintain vigilance";
      }

      stats.set(barangayName, {
        municipality,
        totalAccidents: totalCount,
        criticalCount,
        highCount,
        moderateCount,
        minorCount,
        bystanderReports,
        mdrrmcReports,
        recentIncidents,
        riskLevel,
        severity,
        description,
        riskScore,
        accidents: accidentsInArea,
        accidentTypes,
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
    const severity = stats?.severity || "low";

    const styles = {
      critical: {
        fillColor: "#dc2626",
        color: "#7f1d1d",
        fillOpacity: 0.6,
        weight: 3,
      },
      high: {
        fillColor: "#ea580c",
        color: "#9a3412",
        fillOpacity: 0.5,
        weight: 2.5,
      },
      moderate: {
        fillColor: "#f59e0b",
        color: "#b45309",
        fillOpacity: 0.4,
        weight: 2,
      },
      minor: {
        fillColor: "#84cc16",
        color: "#4d7c0f",
        fillOpacity: 0.3,
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

  const onEachFeature = (feature: any, layer: any) => {
    const barangayName = feature.properties.NAME_3;
    const municipality = feature.properties.NAME_2;
    const province = feature.properties.PROVINCE;
    const stats = barangayStats.get(barangayName);

    if (!barangayName) return;

    const displayStats = stats || {
      riskLevel: "No Data",
      totalAccidents: 0,
      description: "No accidents reported",
      criticalCount: 0,
      highCount: 0,
      moderateCount: 0,
      minorCount: 0,
      bystanderReports: 0,
      mdrrmcReports: 0,
      recentIncidents: 0,
      riskScore: 0,
      accidentTypes: {},
    };

    // Tooltip on hover
    layer.bindTooltip(
      `
      <div style="min-width: 240px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px; color: #111827;">
          Barangay ${barangayName}
        </div>
        <div style="font-size: 11px; color: #6b7280; margin-bottom: 10px;">
          ${municipality}, ${province}
        </div>
        <div style="font-size: 13px; line-height: 1.6;">
          <div style="display: flex; justify-between; margin: 5px 0; padding: 6px; background: #f9fafb; border-radius: 4px;">
            <span style="color: #6b7280; font-weight: 600;">Risk Level:</span>
            <span style="font-weight: 700; color: ${displayStats.severity === "critical"
        ? "#dc2626"
        : displayStats.severity === "high"
          ? "#ea580c"
          : displayStats.severity === "moderate"
            ? "#f59e0b"
            : "#84cc16"
      };">${displayStats.riskLevel}</span>
          </div>
          <div style="display: flex; justify-between; margin: 4px 0;">
            <span style="color: #6b7280;">Total Incidents:</span>
            <span style="font-weight: 600; color: #111827;"> ${displayStats.totalAccidents}</span>
          </div>
          <div style="display: flex; justify-between; margin: 4px 0;">
            <span style="color: #6b7280;">Last 30 days:</span>
            <span style="font-weight: 600; color: #ef4444;"> ${displayStats.recentIncidents}</span>
          </div>
          <div style="display: flex; justify-between; margin: 4px 0;">
            <span style="color: #6b7280;">Risk Score:</span>
            <span style="font-weight: 700; color: #111827;"> ${displayStats.riskScore}/100</span>
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

    // Get top accident types
    const topTypes = Object.entries(displayStats.accidentTypes)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3);

    // Popup on click
    layer.bindPopup(
      `
      <div style="padding: 16px; min-width: 340px; font-family: system-ui, -apple-system, sans-serif;">
        <h3 style="font-weight: 800; font-size: 20px; margin-bottom: 4px; color: #111827;">
          Barangay ${barangayName}
        </h3>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 16px;">
          ${municipality}, ${province}
        </div>
        
        <div style="font-size: 14px;">
          <!-- Risk Assessment Card -->
          <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 14px; border-radius: 10px; margin-bottom: 12px; border-left: 5px solid ${getStyle(feature).fillColor};">
            <div style="font-weight: 700; color: #374151; margin-bottom: 8px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Emergency Risk Assessment</div>
            <div style="font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 6px;">${displayStats.riskLevel}</div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">${displayStats.description}</div>
            <div style="display: flex; align-items-center; gap: 8px; margin-top: 8px;">
              <div style="flex: 1; background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: ${getStyle(feature).fillColor}; height: 100%; width: ${displayStats.riskScore}%; transition: width 0.3s;"></div>
              </div>
              <div style="font-weight: 700; color: #111827; font-size: 13px; min-width: 45px;">${displayStats.riskScore}/100</div>
            </div>
          </div>
          
          <!-- Statistics Grid -->
          <div style="background-color: #f9fafb; padding: 12px; border-radius: 10px; margin-bottom: 12px;">
            <div style="font-weight: 600; color: #4b5563; margin-bottom: 8px; font-size: 11px;">INCIDENT STATISTICS</div>
            <div style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 10px;">${displayStats.totalAccidents} Total Incidents</div>
            ${displayStats.totalAccidents > 0
        ? `
              <div style="font-size: 12px; color: #6b7280; margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 6px; background: white; padding: 6px; border-radius: 6px;">
                  <div style="width: 10px; height: 10px; background: #dc2626; border-radius: 50%;"></div>
                  <span><strong>${displayStats.criticalCount}</strong> Critical</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; background: white; padding: 6px; border-radius: 6px;">
                  <div style="width: 10px; height: 10px; background: #ea580c; border-radius: 50%;"></div>
                  <span><strong>${displayStats.highCount}</strong> High</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; background: white; padding: 6px; border-radius: 6px;">
                  <div style="width: 10px; height: 10px; background: #f59e0b; border-radius: 50%;"></div>
                  <span><strong>${displayStats.moderateCount}</strong> Moderate</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; background: white; padding: 6px; border-radius: 6px;">
                  <div style="width: 10px; height: 10px; background: #84cc16; border-radius: 50%;"></div>
                  <span><strong>${displayStats.minorCount}</strong> Minor</span>
                </div>
              </div>
            `
        : ""
      }
          </div>

          <!-- Data Sources -->
          <div style="background-color: #eff6ff; padding: 12px; border-radius: 10px; margin-bottom: 12px; border: 1px solid #bfdbfe;">
            <div style="font-weight: 600; color: #1e40af; margin-bottom: 8px; font-size: 11px;">DATA SOURCES</div>
            <div style="display: flex; justify-content: space-between; margin: 6px 0;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <div style="width: 8px; height: 8px; background: #7c3aed; border-radius: 50%;"></div>
                <span style="font-size: 12px; color: #1e40af;">MDRRMC Historical</span>
              </div>
              <span style="font-weight: 700; color: #1e40af; font-size: 13px;">${displayStats.mdrrmcReports}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 6px 0;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <div style="width: 8px; height: 8px; background: #2563eb; border-radius: 50%;"></div>
                <span style="font-size: 12px; color: #1e40af;">Bystander Reports</span>
              </div>
              <span style="font-weight: 700; color: #1e40af; font-size: 13px;">${displayStats.bystanderReports}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 6px 0; padding-top: 6px; border-top: 1px solid #bfdbfe;">
              <span style="font-size: 12px; color: #1e40af;">Recent (30 days)</span>
              <span style="font-weight: 700; color: #dc2626; font-size: 13px;">${displayStats.recentIncidents}</span>
            </div>
          </div>

          ${topTypes.length > 0
        ? `
          <!-- Top Incident Types -->
          <div style="background-color: #fef3c7; padding: 12px; border-radius: 10px; border: 1px solid #fde68a;">
            <div style="font-weight: 600; color: #92400e; margin-bottom: 8px; font-size: 11px;">TOP INCIDENT TYPES</div>
            ${topTypes
          .map(
            ([type, count]) => `
              <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px;">
                <span style="color: #92400e;">${type}</span>
                <span style="font-weight: 700; color: #78350f;">${count}</span>
              </div>
            `
          )
          .join("")}
          </div>
          `
        : ""
      }
        </div>
      </div>
    `,
      {
        maxWidth: 360,
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