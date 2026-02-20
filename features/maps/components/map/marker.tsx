import L from "leaflet";

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

export const createPinMarkerIcon = (severity: string, count: number = 1) => {
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

  // smaller pin size
  const pinWidth = 24;
  const pinHeight = 32;

  return L.divIcon({
    className: 'custom-pin-marker',
    html: `
      <div style="position: relative;">
        ${isCritical ? `
          <div style="
            position: absolute;
            top: -3px;
            left: -3px;
            width: ${pinWidth + 6}px;
            height: ${pinHeight + 6}px;
            background: ${color}30;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            animation: pulse-pin 2s ease-out infinite;
            z-index: 0;
          "></div>
          <style>
            @keyframes pulse-pin {
              0% { transform: rotate(-45deg) scale(1); opacity: 0.8; }
              100% { transform: rotate(-45deg) scale(1.5); opacity: 0; }
            }
          </style>
        ` : ''}

        <!-- Pin Shape -->
        <svg width="${pinWidth}" height="${pinHeight}" viewBox="0 0 32 40" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); position: relative; z-index: 1;">
          <!-- Pin body without border -->
          <path d="M16 0 C7.2 0 0 7.2 0 16 C0 24 16 40 16 40 S32 24 32 16 C32 7.2 24.8 0 16 0 Z" 
                fill="${color}" />
          <!-- Inner circles -->
          <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
          <circle cx="16" cy="16" r="4" fill="${color}"/>
        </svg>

        ${hasMultiple ? `
          <div style="
            position: absolute;
            top: -6px;
            right: -6px;
            min-width: 18px;
            height: 18px;
            background: #DC2626;
            color: white;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            padding: 0 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 2;
          ">${count}</div>
        ` : ''}
      </div>
    `,
    iconSize: [pinWidth, pinHeight],
    iconAnchor: [pinWidth / 2, pinHeight],
    popupAnchor: [0, -pinHeight],
  });
};

