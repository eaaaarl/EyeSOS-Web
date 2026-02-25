"use client";

import { useState } from "react";
import { useSendPasswordResetEmailMutation } from "@/features/auth/api/authApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [sendResetEmail, { isLoading }] = useSendPasswordResetEmailMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        const result = await sendResetEmail({ email });

        if ("error" in result) {
            toast.error("Could not send reset email. Please check your email and try again.");
            return;
        }

        setSent(true);
        toast.success("Check your inbox for the reset link.");
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
                                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Forgot Password</h1>
                                    <p className="text-sm text-muted-foreground text-balance">
                                        {sent
                                            ? "Check your inbox for instructions"
                                            : "Enter your email to receive a reset link"}
                                    </p>
                                </div>

                                {sent ? (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                                            <p className="text-sm text-emerald-800 font-medium">
                                                Reset link sent to <br />
                                                <strong className="text-emerald-950">{email}</strong>
                                            </p>
                                        </div>
                                        <Button asChild variant="outline" className="w-full rounded-xl">
                                            <Link href="/" className="flex items-center justify-center gap-2">
                                                <ArrowLeft className="w-4 h-4" />
                                                Back to Login
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="name@example.com"
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
                                                "Send Reset Link"
                                            )}
                                        </Button>

                                        <div className="text-center">
                                            <Link
                                                href="/"
                                                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors inline-flex items-center gap-1"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" />
                                                Return to sign in
                                            </Link>
                                        </div>
                                    </form>
                                )}
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