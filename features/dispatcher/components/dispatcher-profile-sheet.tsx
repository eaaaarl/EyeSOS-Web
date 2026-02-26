"use client";

import { BaseProfileSheet, ProfileSheetConfig } from "../../maps/components/dialogs/base-profile-sheet";
import { Shield, Activity } from "lucide-react";

const adminConfig: ProfileSheetConfig = {
    roleLabel: "Official",
    statusLabel: "Status",
    statusValue: "Authorized",
    activityLabel: "Monitoring",
    activityValue: "Online",
    statsTitle: "Dispatch Overview",
    statsManagedLabel: "Managed",
    primaryColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600",
    icon: Shield,
    activityIcon: Activity,
};

interface DispatcherProfileSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DispatcherProfileSheet({ isOpen, onOpenChange }: DispatcherProfileSheetProps) {
    return (
        <BaseProfileSheet
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            config={adminConfig}
        />
    );
}
