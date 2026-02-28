"use client";

import { useEffect, useState } from "react";
import { useAuthUsecases } from "@/features/auth/hooks/use-auth-usecases";
import { Profile } from "@/features/auth/api/interface";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UserCircle } from "lucide-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export function UserProfile() {
  const { getUserProfileUsecase } = useAuthUsecases();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Get current user from supabase
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Using the usecase approach
        const usecase = getUserProfileUsecase();
        const result = await usecase.execute({ userId: user.id });

        if (result.profile) {
          setProfile(result.profile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [getUserProfileUsecase, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        No profile found
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <UserCircle className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 uppercase">
                {profile.user_type}
              </span>
              {profile.mobileNo && (
                <span className="text-sm text-muted-foreground">
                  {profile.mobileNo}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
