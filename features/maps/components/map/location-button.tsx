"use client";
import { useCurrentLocation } from "../../hooks/use-current-location";

export function LocationButton() {
    const { getCurrentLocation, isLoading } = useCurrentLocation();

    return (
        <div className="absolute bottom-32 right-3 z-[1000]">
            <button
                onClick={getCurrentLocation}
                disabled={isLoading}
                title="My location"
                style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    cursor: isLoading ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {isLoading ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="7" stroke="#4285F4" strokeWidth="2.5"
                            strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round">
                            <animateTransform attributeName="transform" type="rotate"
                                from="0 9 9" to="360 9 9" dur="0.8s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 19 12 19Z" fill="#4285F4" />
                    </svg>
                )}
            </button>
        </div>
    );
}