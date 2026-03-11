"use client";

import { useGetUserProfileQuery } from "@/features/auth/api/authApi";
import { useAppSelector } from "@/lib/redux/hooks";
import { EditProfileForm } from "@/features/responder/components/edit-profile-form";
import { Loader2 } from "lucide-react";

export default function EditProfilePage() {
    const { user } = useAppSelector((state) => state.auth);

    const { data: profileData, isLoading } = useGetUserProfileQuery(
        { user_id: user?.id || "" },
        { skip: !user?.id }
    );

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    if (!profileData?.profile) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-muted-foreground">Profile not found</p>
            </div>
        );
    }

    return (
        <main className="p-6 max-w-lg mx-auto bg-background min-h-screen">
            <EditProfileForm profile={profileData.profile} />
        </main>
    );
}
