"use client";

import dynamic from "next/dynamic";

const ResponderMap = dynamic(() => import("@/features/maps/components/map/responder-map").then(mod => mod.ResponderMap), {
    ssr: false,
});

export default function ResponderMapPage() {
    return (
        <main className="h-screen w-full">
            <ResponderMap />
        </main>
    );
}
