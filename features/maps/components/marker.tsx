import L from "leaflet";
export const createRedNeedleIcon = (severity: string) => {
  const severityColors = {
    'Critical': '#DC2626',  // Red
    'High': '#EA580C',      // Orange 
    'Moderate': '#F59E0B',  // Yellow/Amber
    'Low': '#10B981'        // Green
  };
  const color = severityColors[severity as keyof typeof severityColors] || '#6B7280';
  const isCritical = severity === 'Critical';
  return L.divIcon({
    className: 'custom-needle-marker',
    html: `
      <div style="position: relative;">
        ${isCritical ? `
          <div style="position: absolute; top: -8px; left: -8px; width: 56px; height: 56px; background: ${color}33; border-radius: 50%; animation: pulse 2s infinite;"></div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.4; }
              50% { transform: scale(1.3); opacity: 0.7; }
            }
          </style>
        ` : ''}
        <svg width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="20" x2="20" y2="56" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
          <circle cx="20" cy="16" r="12" fill="${color}"/>
          <circle cx="20" cy="16" r="12" fill="url(#grad)" opacity="0.8"/>
          <ellipse cx="16" cy="12" rx="4" ry="5" fill="white" opacity="0.5"/>
          <defs>
            <radialGradient id="grad">
              <stop offset="30%" stop-color="white" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="${color}" stop-opacity="0.9"/>
            </radialGradient>
          </defs>
        </svg>
      </div>
    `,
    iconSize: [35, 55],
    iconAnchor: [20, 56],
    popupAnchor: [0, -56],
  });
};