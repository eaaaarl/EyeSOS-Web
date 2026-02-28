"use client";

import dynamic from "next/dynamic";

const ResponderMapInner = dynamic(
    () =>
        import("@/features/responder/components/responder-map").then(
            (mod) => mod.ResponderMap
        ),
    { ssr: false }
);

interface MapTabProps {
    onBack?: () => void;
    onDrawerChange?: (open: boolean) => void;
}

export function MapTab({ onBack, onDrawerChange }: MapTabProps) {
    return (
        <div className="h-full w-full overflow-hidden">
            <ResponderMapInner onBack={onBack} onDrawerChange={onDrawerChange} />
        </div>
    );
}