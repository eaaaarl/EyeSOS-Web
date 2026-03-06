"use client";

import dynamic from "next/dynamic";

const AdminMap = dynamic(() => import("@/features/admin/components/maps/admin-map").then(mod => mod.AdminMap), {
    ssr: false,
});

export default function AdminMapPage() {
    return (
        <main className="h-screen w-full">
            <AdminMap />
        </main>
    );
}
