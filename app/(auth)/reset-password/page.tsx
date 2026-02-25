"use client";

import { useState } from "react";
import { useUpdatePasswordMutation } from "@/features/auth/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
    const router = useRouter();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            toast.info("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            toast.info("Password must be at least 8 characters long.");
            return;
        }

        const result = await updatePassword({ password });

        if ("error" in result) {
            toast.error("Could not update your password. The link might be expired.");
            return;
        }

        // Sign out to clear the recovery session before redirecting to login
        const { supabase } = await import("@/lib/supabase");
        await supabase.auth.signOut();

        toast.success("Password updated! You can now log in.");
        router.push("/login");
    };

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
                <Card className="overflow-hidden border-none shadow-2xl">
                    <CardContent className="p-0">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="animate-in fade-in zoom-in duration-500 mb-2">
                                        <div className="relative">
                                            <div className="absolute -inset-2 rounded-full bg-red-500/5 blur-2xl animate-pulse" />
                                            <Image
                                                width={120}
                                                height={120}
                                                src="/logo-nobg.png"
                                                alt="EyeSOS Logo"
                                                className="relative h-24 w-24 object-contain"
                                            />
                                        </div>
                                    </div>
                                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reset Password</h1>
                                    <p className="text-sm text-muted-foreground text-balance">
                                        Secure your account with a new password
                                    </p>
                                </div>

                                <form onSubmit={handleReset} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password font-semibold text-gray-700">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                                className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm" className="font-semibold text-gray-700">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="confirm"
                                                type={showPassword ? "text" : "password"}
                                                value={confirm}
                                                onChange={(e) => setConfirm(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                                className="pl-10 h-11 rounded-xl border-gray-200 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all duration-200"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            "Update Password"
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <Link
                                            href="/"
                                            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                                        >
                                            Cancel and return to login
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <p className="mt-8 text-center text-[10px] text-muted-foreground opacity-70">
                    &copy; {new Date().getFullYear()} EyeSOS. All rights reserved.
                </p>
            </div>
        </div>
    );
}