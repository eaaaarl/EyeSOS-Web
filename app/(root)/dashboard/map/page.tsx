"use client";

import dynamic from "next/dynamic";

const AdminMap = dynamic(() => import("@/features/maps/components/map/admin-map").then(mod => mod.AdminMap), {
    ssr: false,
});

export default function AdminMapPage() {
    return (
        <main className="h-screen w-full">
            <AdminMap />
        </main>
    );
}
