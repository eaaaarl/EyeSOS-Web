"use client";

import dynamic from "next/dynamic";

// Import map component dynamically to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/Maps"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-100">
      <p className="text-lg text-zinc-600">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="h-screen w-full">
      <MapComponent />
    </main>
  );
}