'use client'
import { useState } from "react";
import { Home, Map, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeTab } from "./tabs/home-tab";
import { MapTab } from "./tabs/map-tab";
import { ProfileTab } from "./tabs/profile-tab";

type Tab = "home" | "map" | "profile";

export function ResponderShell() {
    const [activeTab, setActiveTab] = useState<Tab>("home");

    const tabs = [
        { id: "home" as Tab, label: "Home", icon: Home },
        { id: "map" as Tab, label: "Map", icon: Map },
        { id: "profile" as Tab, label: "Profile", icon: User },
    ];

    return (
        <div className="fixed inset-0 flex flex-col bg-background overflow-hidden">

            {/* Tab content area */}
            <div className="flex-1 min-h-0 relative">
                <div className={cn(
                    "absolute inset-0",
                    activeTab === "home" ? "z-10" : "z-0 pointer-events-none invisible"
                )}>
                    <HomeTab onAcceptDispatch={() => setActiveTab("map")} />
                </div>

                <div className={cn(
                    "absolute inset-0 overflow-hidden",
                    activeTab === "map" ? "z-10" : "z-0 pointer-events-none invisible"
                )}>
                    <MapTab
                        onBack={() => setActiveTab("home")}
                    />
                </div>

                <div className={cn(
                    "absolute inset-0",
                    activeTab === "profile" ? "z-10" : "z-0 pointer-events-none invisible"
                )}>
                    <ProfileTab />
                </div>
            </div>

            {/* Bottom nav — always visible per user request */}
            <nav className="relative z-[9999] bg-background border-t border-border shrink-0">
                <div className="flex items-center justify-around h-16 px-4">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                                activeTab === id
                                    ? "text-red-600"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon
                                size={22}
                                className={cn(
                                    "transition-transform",
                                    activeTab === id && "scale-110"
                                )}
                            />
                            <span className="text-[10px] font-medium tracking-wide">{label}</span>
                            {activeTab === id && (
                                <span className="absolute bottom-0 w-8 h-0.5 bg-red-600 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}