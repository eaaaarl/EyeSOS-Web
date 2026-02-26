"use client";

import { useState } from "react";
import { BaseMap } from "./base-map";
import { MapNavigation } from "./map-navigation";
import { ProfileSheet } from "../dialogs/profile-sheet";
import { ResponderDispatchAlert } from "./responder-dispatch-alert";

export function ResponderMap() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <BaseMap>
                {/* Responders might see assigned markers here in the future */}
            </BaseMap>

            <MapNavigation
                isResponder={true}
                reports={[]}
                onMenuClick={() => setIsOpen(true)}
            />
            <ProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
            <ResponderDispatchAlert />
        </>
    );
}
