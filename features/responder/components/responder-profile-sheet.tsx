"use client";

import { BaseProfileSheet, ProfileSheetConfig } from "../../maps/components/dialogs/base-profile-sheet";
import { Activity } from "lucide-react";

const responderConfig: ProfileSheetConfig = {
    roleLabel: "Responder",
    statusLabel: "Status",
    statusValue: "Active",
    activityLabel: "Ready",
    activityValue: "On Duty",
    statsTitle: "Response Activity",
    statsManagedLabel: "Total",
    primaryColor: "bg-red-600",
    hoverColor: "hover:bg-red-700",
    gradientFrom: "from-red-600",
    gradientTo: "to-orange-600",
    icon: Activity,
    activityIcon: Activity,
};

interface ResponderProfileSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ResponderProfileSheet({ isOpen, onOpenChange }: ResponderProfileSheetProps) {
    return (
        <BaseProfileSheet
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            config={responderConfig}
        />
    );
}
