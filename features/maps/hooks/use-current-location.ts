import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import { useUpdateResponderLocationMutation } from "../api/mapApi";
import { useAppSelector } from "@/lib/redux/hooks";

let sharedLocation: [number, number] | null = null;
let sharedLoading = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
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

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [user, updateLocation]);

  useEffect(() => {
    if (autoRequest) {
      getCurrentLocation();
    }
  }, [autoRequest]); // eslint-disable-line

  return {
    getCurrentLocation,
    isLoading: sharedLoading,
    location: sharedLocation,
  };
}
