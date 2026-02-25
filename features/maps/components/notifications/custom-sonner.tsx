"use client";

import { toast } from "sonner";
import { AlertCircle, CheckCircle2, AlertTriangle, Bell, Radio, ShieldAlert, Zap, X } from "lucide-react";

const BASE_CONFIG = {
    position: "top-center" as const,
    unstyled: true,
};

// Shared compact wrapper styles
const base = `
  relative overflow-hidden flex items-center gap-3
  w-[340px] px-3.5 py-2.5
  rounded-xl shadow-lg
  animate-in fade-in slide-in-from-top-2 duration-250
`;

export const showNotification = {
    success: (title: string, description?: string) => {
        toast.custom(
            (t) => (
                <div
                    onClick={() => toast.dismiss(t)}
                    className={`${base} bg-gray-950/95 border border-gray-800 cursor-pointer hover:border-emerald-800/60 transition-colors backdrop-blur-sm`}
                >
                    <div className="absolute left-0 inset-y-0 w-[3px] bg-emerald-500 rounded-l-xl" />
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white leading-tight">{title}</p>
                        {description && <p className="text-[11px] text-gray-500 mt-0.5 leading-snug truncate">{description}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">OK</span>
                        <X className="w-3 h-3 text-gray-600" />
                    </div>
                </div>
            ),
            { ...BASE_CONFIG, duration: 4000 }
        );
    },

    error: (title: string, description?: string) => {
        toast.custom(
            (t) => (
                <div
                    onClick={() => toast.dismiss(t)}
                    className={`${base} bg-gray-950/95 border border-gray-800 cursor-pointer hover:border-red-900/60 transition-colors backdrop-blur-sm`}
                >
                    <div className="absolute left-0 inset-y-0 w-[3px] bg-red-500 rounded-l-xl" />
                    <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white leading-tight">{title}</p>
                        {description && <p className="text-[11px] text-gray-500 mt-0.5 leading-snug truncate">{description}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Error</span>
                        <X className="w-3 h-3 text-gray-600" />
                    </div>
                </div>
            ),
            { ...BASE_CONFIG, duration: 5000 }
        );
    },

    warning: (title: string, description?: string) => {
        toast.custom(
            (t) => (
                <div
                    onClick={() => toast.dismiss(t)}
                    className={`${base} bg-gray-950/95 border border-gray-800 cursor-pointer hover:border-amber-900/60 transition-colors backdrop-blur-sm`}
                >
                    <div className="absolute left-0 inset-y-0 w-[3px] bg-amber-400 rounded-l-xl" />
                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white leading-tight">{title}</p>
                        {description && <p className="text-[11px] text-gray-500 mt-0.5 leading-snug truncate">{description}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Warn</span>
                        <X className="w-3 h-3 text-gray-600" />
                    </div>
                </div>
            ),
            { ...BASE_CONFIG, duration: 5000 }
        );
    },

    info: (title: string, description?: string) => {
        toast.custom(
            (t) => (
                <div
                    onClick={() => toast.dismiss(t)}
                    className={`${base} bg-gray-950/95 border border-gray-800 cursor-pointer hover:border-sky-900/60 transition-colors backdrop-blur-sm`}
                >
                    <div className="absolute left-0 inset-y-0 w-[3px] bg-sky-500 rounded-l-xl" />
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                        <Radio className="w-3.5 h-3.5 text-sky-400" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white leading-tight">{title}</p>
                        {description && <p className="text-[11px] text-gray-500 mt-0.5 leading-snug truncate">{description}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider">Info</span>
                        <X className="w-3 h-3 text-gray-600" />
                    </div>
                </div>
            ),
            { ...BASE_CONFIG, duration: 4000 }
        );
    },

    incident: (title: string, description?: string, onRespond?: () => void) => {
        toast.custom(
            (t) => (
                <div
                    className="
                        relative overflow-hidden
                        w-[360px] rounded-xl backdrop-blur-sm
                        bg-gray-950/98 border border-gray-800
                        animate-in fade-in slide-in-from-top-3 duration-300
                    "
                    style={{ boxShadow: "0 0 0 1px rgba(239,68,68,0.12), 0 8px 32px rgba(0,0,0,0.5)" }}
                >
                    {/* Thin top accent */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-70" />

                    <div className="px-3.5 py-3 flex items-start gap-3">
                        <div className="relative shrink-0 mt-0.5">
                            <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center">
                                <Bell className="w-4 h-4 text-red-400" strokeWidth={2.5} />
                            </div>
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-950 animate-pulse" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[9px] font-black text-red-400 uppercase tracking-[0.15em]">Incident Alert</span>
                                <span className="text-[9px] text-gray-600 font-mono">
                                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-white leading-tight">{title}</h4>
                            {description && (
                                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{description}</p>
                            )}

                            <div className="flex items-center gap-2 mt-2.5">
                                <button
                                    onClick={() => { onRespond?.(); toast.dismiss(t); }}
                                    className="h-6 px-3 bg-red-600 hover:bg-red-500 rounded-md text-[11px] font-bold text-white transition-colors flex items-center gap-1"
                                >
                                    <Zap className="w-3 h-3" />
                                    Respond
                                </button>
                                <button
                                    onClick={() => toast.dismiss(t)}
                                    className="h-6 px-3 rounded-md text-[11px] font-semibold text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            { ...BASE_CONFIG, duration: 10000 }
        );
    },

    critical: (title: string, description?: string, onRespond?: () => void) => {
        toast.custom(
            (t) => (
                <div
                    className="
                        relative overflow-hidden
                        w-[380px] rounded-xl
                        animate-in fade-in slide-in-from-top-4 duration-300
                    "
                    style={{
                        background: "linear-gradient(to bottom, #1c0a0a, #120606)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        boxShadow: "0 0 0 1px rgba(239,68,68,0.06), 0 16px 48px rgba(0,0,0,0.6), 0 0 20px rgba(220,38,38,0.08)"
                    }}
                >
                    {/* Marching stripe top */}
                    <div
                        className="h-[3px] w-full"
                        style={{
                            background: "repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 12px, #450a0a 12px, #450a0a 24px)",
                            animation: "march 0.5s linear infinite"
                        }}
                    />

                    <div className="px-4 py-3 flex items-center gap-3.5">
                        <div className="relative shrink-0">
                            <div className="absolute -inset-1.5 rounded-full bg-red-500/8 animate-ping" style={{ animationDuration: "1.2s" }} />
                            <div className="relative w-10 h-10 bg-red-950 border border-red-900/50 rounded-xl flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 text-red-400" strokeWidth={2} />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-950 border border-red-900/50 rounded text-[8px] font-black text-red-400 uppercase tracking-widest">
                                    <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                                    Critical
                                </span>
                                <span className="text-[9px] text-gray-600 font-mono">
                                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                            <h4 className="text-sm font-black text-white leading-tight">{title}</h4>
                            {description && <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{description}</p>}

                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() => { onRespond?.(); toast.dismiss(t); }}
                                    className="h-6 px-3 bg-red-700 hover:bg-red-600 border border-red-600/40 rounded-md text-[11px] font-bold text-white transition-colors flex items-center gap-1"
                                >
                                    <Zap className="w-3 h-3" />
                                    Respond Now
                                </button>
                                <button
                                    onClick={() => toast.dismiss(t)}
                                    className="h-6 px-3 rounded-md text-[11px] font-semibold text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                    Acknowledge
                                </button>
                            </div>
                        </div>
                    </div>

                    <style>{`@keyframes march { to { background-position: 24px 0 } }`}</style>
                </div>
            ),
            { ...BASE_CONFIG, duration: 0 }
        );
    },
};