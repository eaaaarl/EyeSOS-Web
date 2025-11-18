import { useEffect, useState } from "react";
import L from "leaflet";
import { mockAccidents } from "@/data/mockData";
import { createRedNeedleIcon } from "@/features/maps/components/marker";

export function useMapIcons() {
  const [icons, setIcons] = useState<Map<number, L.DivIcon>>(new Map());

  useEffect(() => {
    const iconMap = new Map<number, L.DivIcon>();
    mockAccidents.forEach((accident) => {
      iconMap.set(accident.id, createRedNeedleIcon(accident.severity));
    });
    setTimeout(() => {
      setIcons(iconMap);
    }, 0);
  }, []);

  return icons;
}

