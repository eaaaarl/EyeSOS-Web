import L from "leaflet";
import { Report } from "../interface/get-all-reports-bystander.interface";

export const createCircleMarkerIcon = (severity: string) => {
  const normalizedSeverity = severity?.toLowerCase() || 'minor';
  const severityConfig = {
    'critical': {
      color: '#DC2626',
      label: '!',
      size: 'large'
    },
    'high': {
      color: '#EA580C',
      label: '!',
      size: 'large'
    },
    'moderate': {
      color: '#F59E0B',
      label: 'i',
      size: 'medium'
    },
    'minor': {
      color: '#10B981',
      label: 'i',
      size: 'medium'
    }
  };

  const config = severityConfig[normalizedSeverity as keyof typeof severityConfig] || {
    color: '#6B7280',
    label: '?',
    size: 'medium'
  };

  const sizes = {
    small: { outer: 48, inner: 40, font: 16 },
    medium: { outer: 56, inner: 48, font: 18 },
    large: { outer: 72, inner: 64, font: 24 }
  };

  const size = sizes[config.size as keyof typeof sizes];
  const isCritical = normalizedSeverity === 'critical';

  return L.divIcon({
    className: 'custom-circle-marker',
    html: `
      <div style="position: relative; width: ${size.outer}px; height: ${size.outer}px;">
        ${isCritical ? `
          <div class="pulse-ring" style="
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${size.outer + 16}px;
            height: ${size.outer + 16}px;
            margin: -${(size.outer + 16) / 2}px 0 0 -${(size.outer + 16) / 2}px;
            background: ${config.color}40;
            border-radius: 50%;
            animation: pulse 2s ease-out infinite;
          "></div>
          <style>
            @keyframes pulse {
              0% {
                transform: scale(0.8);
                opacity: 1;
              }
              100% {
                transform: scale(1.4);
                opacity: 0;
              }
            }
          </style>
        ` : ''}
        
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size.outer}px;
          height: ${size.outer}px;
          margin: -${size.outer / 2}px 0 0 -${size.outer / 2}px;
          background: white;
          border: 3px solid ${config.color};
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: ${size.font}px;
          color: ${config.color};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          cursor: pointer;
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          ${config.label}
        </div>
        
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          width: 0;
          height: 0;
          margin-left: -6px;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid ${config.color};
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
        "></div>
      </div>
    `,
    iconSize: [size.outer, size.outer + 8],
    iconAnchor: [size.outer / 2, size.outer + 8],
    popupAnchor: [0, -(size.outer + 8)],
  });
};

export const createDotMarkerIcon = (severity: string, count: number = 1) => {
  const normalizedSeverity = severity?.toLowerCase() || 'minor';
  const severityColors = {
    'critical': '#DC2626',
    'high': '#EA580C',
    'moderate': '#F59E0B',
    'minor': '#10B981'
  };

  const color = severityColors[normalizedSeverity as keyof typeof severityColors] || '#6B7280';
  const isCritical = normalizedSeverity === 'critical';
  const hasMultiple = count > 1;
  const baseSize = 20; // Medium size for better balance
  const borderWidth = 3; // Adjusted border for medium size

  return L.divIcon({
    className: 'custom-dot-marker',
    html: `
      <div style="position: relative;">
        ${isCritical ? `
          <div style="
            position: absolute;
            top: -8px;
            left: -8px;
            width: ${baseSize + 16}px;
            height: ${baseSize + 16}px;
            background: ${color}30;
            border-radius: 50%;
            animation: pulse-dot 2s ease-out infinite;
          "></div>
          <style>
            @keyframes pulse-dot {
              0% { transform: scale(1); opacity: 0.8; }
              100% { transform: scale(2); opacity: 0; }
            }
          </style>
        ` : ''}
        
        <div style="
          width: ${baseSize}px;
          height: ${baseSize}px;
          background: ${color};
          border: ${borderWidth}px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0,0,0,0.4);
          cursor: pointer;
        "></div>
        
        ${hasMultiple ? `
          <div style="
            position: absolute;
            top: -12px;
            right: -12px;
            min-width: 24px;
            height: 24px;
            background: #DC2626;
            color: white;
            border: 3px solid white;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            padding: 0 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">${count}</div>
        ` : ''}
      </div>
    `,
    iconSize: [baseSize + (hasMultiple ? 24 : 0), baseSize + (hasMultiple ? 24 : 0)],
    iconAnchor: [(baseSize + (hasMultiple ? 24 : 0)) / 2, (baseSize + (hasMultiple ? 24 : 0)) / 2],
    popupAnchor: [0, -(baseSize + (hasMultiple ? 24 : 0)) / 2],
  });
};

export const groupMarkersByLocation = (reports: Array<Report>) => {
  const grouped = new Map<string, Array<Report>>();

  reports.forEach(report => {
    // Group by location with 6 decimal precision (~0.1m accuracy)
    const key = `${report.latitude.toFixed(6)},${report.longitude.toFixed(6)}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(report);
  });

  return Array.from(grouped.entries()).map(([location, items]) => {
    const [lat, lng] = location.split(',').map(Number);

    // Determine highest severity from all reports at this location
    const highestSeverity = items.reduce((highest, item) => {
      const severityOrder = ['critical', 'high', 'moderate', 'minor'];
      const itemSeverity = item.severity?.toLowerCase() || 'minor';
      const currentIndex = severityOrder.indexOf(itemSeverity);
      const highestIndex = severityOrder.indexOf(highest);
      return currentIndex !== -1 && currentIndex < highestIndex ? itemSeverity : highest;
    }, 'minor');

    return {
      lat,
      lng,
      severity: highestSeverity,
      count: items.length,
      reports: items, // All reports at this location
      primaryReport: items[0] // Use first report as primary for popup
    };
  });
};