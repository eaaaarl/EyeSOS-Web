"use client";

import dynamic from "next/dynamic";

const DispatcherMap = dynamic(() => import("@/features/dispatcher/components/dispatcher-map").then(mod => mod.DispatcherMap), {
    ssr: false,
});

export default function DispatcherMapPage() {
    return (
        <main className="h-screen w-full">
            <DispatcherMap />
        </main>
    );
}
