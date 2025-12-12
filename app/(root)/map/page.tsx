"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/features/maps"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="h-screen w-full">
      <MapComponent />
    </main>
  );
}