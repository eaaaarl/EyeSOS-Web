"use client";
import { useState } from "react";
import { BaseMap } from "./base-map";
import { MapNavigation } from "./map-navigation";
import { ResponderProfileSheet } from "../dialogs/responder-profile-sheet";
import { ResponderDispatchAlert } from "./responder-dispatch-alert";
import { LocationMarker } from "./location-marker";
import { LocationButton } from "./location-button";

export function ResponderMap() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="h-screen w-screen relative">
            <BaseMap>
                <LocationMarker />
            </BaseMap>

            <LocationButton />
            <MapNavigation
                isResponder={true}
                reports={[]}
                onMenuClick={() => setIsOpen(true)}
            />
            <ResponderProfileSheet isOpen={isOpen} onOpenChange={setIsOpen} />
            <ResponderDispatchAlert />
        </div>
    );
}