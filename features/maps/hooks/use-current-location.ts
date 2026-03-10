import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import { useUpdateResponderLocationMutation } from "../api/mapApi";
import { useAppSelector } from "@/lib/redux/hooks";

let sharedLocation: [number, number] | null = null;
let sharedLoading = false;
const listeners = new Set<() => void>();

let watchId: number | null = null;
let lastUpdateTimestamp = 0;
let lastUpdateCoords: [number, number] | null = null;

function notify() {
  listeners.forEach((fn) => fn());
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
}

export function useCurrentLocation(autoRequest = false) {
  const { user } = useAppSelector((state) => state.auth);
  const [updateLocation] = useUpdateResponderLocationMutation();
  const [, rerender] = useState(0);

  useState(() => {
    const fn = () => rerender((n) => n + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  });

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    if (watchId !== null) return; // Already tracking

    sharedLoading = true;
    notify();

    watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        sharedLocation = [latitude, longitude];
        sharedLoading = false;
        notify();

        if (user?.id) {
          const now = Date.now();
          const timeSinceLastUpdate = now - lastUpdateTimestamp;

          let distance = 0;
          if (lastUpdateCoords) {
            distance = calculateDistance(
              lastUpdateCoords[0],
              lastUpdateCoords[1],
              latitude,
              longitude,
            );
          }

          if (
            timeSinceLastUpdate > 15000 ||
            distance > 20 ||
            !lastUpdateCoords
          ) {
            lastUpdateTimestamp = now;
            lastUpdateCoords = [latitude, longitude];
            try {
              await updateLocation({
                userId: user.id,
                latitude,
                longitude,
              }).unwrap();
            } catch (error) {
              console.error("Failed to update location:", error);
            }
          }
        }
      },
      (error) => {
        sharedLoading = false;
        notify();
        let message = "Unable to retrieve your location";
        if (error.code === error.PERMISSION_DENIED) {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          message = isIOS
            ? "Go to Settings → Privacy & Security → Location Services → Safari → Allow"
            : "Location denied. Enable it in your browser settings.";
        }
        toast.error(message, { duration: 6000 });
      },
      { enableHighAccuracy: true, maximumAge: 0 },
    );
  }, [user, updateLocation]);

  const getCurrentLocation = useCallback(() => {
    return new Promise<{ latitude: number; longitude: number }>(
      (resolve, reject) => {
        if (!navigator.geolocation) {
          toast.error("Geolocation is not supported by your browser");
          reject(new Error("Geolocation not supported"));
          return;
        }

        sharedLoading = true;
        notify();

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            sharedLocation = [latitude, longitude];
            sharedLoading = false;
            notify();

            if (user?.id) {
              lastUpdateTimestamp = Date.now();
              lastUpdateCoords = [latitude, longitude];
              try {
                await updateLocation({
                  userId: user.id,
                  latitude,
                  longitude,
                }).unwrap();
              } catch (error) {
                console.error("Failed to update location:", error);
              }
            }
            resolve({ latitude, longitude });
          },
          (error) => {
            sharedLoading = false;
            notify();
            let message = "Unable to retrieve your location";
            if (error.code === error.PERMISSION_DENIED) {
              const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
              message = isIOS
                ? "Go to Settings → Privacy & Security → Location Services → Safari → Allow"
                : "Location denied. Enable it in your browser settings.";
            }
            toast.error(message, { duration: 6000 });
            reject(new Error(message));
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
      },
    );
  }, [user, updateLocation]);

  useEffect(() => {
    if (autoRequest) {
      startTracking();
    }
  }, [autoRequest, startTracking]);

  return {
    getCurrentLocation,
    startTracking,
    isLoading: sharedLoading,
    location: sharedLocation,
  };
}
