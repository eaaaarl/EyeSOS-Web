import { useEffect, useState } from "react";
import L from "leaflet";
import { useGetAllReportsBystanderQuery } from "../api/mapApi";
import { createCircleMarkerIcon } from "../components/map/marker";

export function useMapIcons() {
  const [icons, setIcons] = useState<Map<number, L.DivIcon>>(new Map());

  // Query for to get all the reports send by the bystander
  const { data: allReports } = useGetAllReportsBystanderQuery();

  useEffect(() => {
    const iconMap = new Map<number, L.DivIcon>();
    allReports?.reports.forEach((accident) => {
      iconMap.set(
        Number(accident.id),
        createCircleMarkerIcon(accident.severity),
      );
    });
    setTimeout(() => {
      setIcons(iconMap);
    }, 0);
  }, [allReports?.reports]);

  return icons;
}
