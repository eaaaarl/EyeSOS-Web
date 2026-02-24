"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setClearUserSession } from "@/lib/redux/state/authSlice";
import { useGetUserProfileQuery } from "@/features/auth/api/authApi";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Phone, Shield, Edit, Settings, Activity, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface ProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSheet({ isOpen, onOpenChange }: ProfileSheetProps) {
  const isMobile = useIsMobile();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: profileData, isLoading } = useGetUserProfileQuery(
    { user_id: user?.id || "" },
    { skip: !user?.id }
  );

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      dispatch(setClearUserSession());
      router.push("/");
      onOpenChange(false);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const profile = profileData?.profile;
  const userEmail = user?.email || profile?.email || "N/A";
  const userName = profile?.name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userPhone = profile?.mobileNo || "N/A";
  const userInitials = userName.split(" ").map((n: unknown[]) => n?.[0] || "").join("").toUpperCase().slice(0, 2);
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A";

  const ProfileInfo = () => (
    <>
      <div className="relative shrink-0">
        <div className="h-16 bg-linear-to-br from-red-600 via-red-500 to-orange-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-3 left-3">
            <Activity className="w-5 h-5 text-white/80" />
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -bottom-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-linear-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                  {userInitials}
                </div>
              )}
            </div>
            <button className="absolute bottom-1 right-1 w-7 h-7 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-colors">
              <Edit className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-16 px-4 pb-4">
        {isMobile ? (
          <DrawerHeader className="text-center space-y-1 mb-4">
            <DrawerTitle className="text-xl font-bold text-gray-900">{userName}</DrawerTitle>
            <DrawerDescription className="text-xs text-gray-500">
              Responder since {memberSince}
            </DrawerDescription>
          </DrawerHeader>
        ) : (
          <SheetHeader className="text-center space-y-1 mb-4">
            <SheetTitle className="text-xl font-bold text-gray-900">{userName}</SheetTitle>
            <SheetDescription className="text-xs text-gray-500">
              Responder since {memberSince}
            </SheetDescription>
          </SheetHeader>
        )}

        {isLoading ? (
          <div className="text-center py-6">
            <div className="inline-block w-6 h-6 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-2 text-sm">Loading profile...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-3 border border-red-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-[10px] font-semibold text-red-600 uppercase">Status</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-gray-900">Active</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Activity className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-[10px] font-semibold text-green-600 uppercase">Ready</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-gray-900">On Duty</p>
              </div>
            </div>

            {/* Response Stats */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-3 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-gray-700">Response Activity</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-bold text-gray-900">0</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 truncate">Total</p>
                </div>
                <div className="min-w-0 border-x border-amber-200 px-1">
                  <p className="text-lg sm:text-xl font-bold text-gray-900">0</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 truncate">This Month</p>
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-bold text-gray-900">-</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 truncate">Avg. Time</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Contact Information
              </h3>

              <div className="space-y-2">
                <div className="group bg-white hover:bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-red-300 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2.5 flex-1">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-gray-500 mb-0.5">Email Address</p>
                        <p className="text-xs font-medium text-gray-900 truncate">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group bg-white hover:bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-red-300 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2.5 flex-1">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-gray-500 mb-0.5">Phone Number</p>
                        <p className="text-xs font-medium text-gray-900">{userPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-3 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 h-9 hover:bg-gray-50 text-sm"
              >
                <Settings className="w-3.5 h-3.5" />
                Account Settings
              </Button>

              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2 h-9 bg-red-600 hover:bg-red-700 text-sm"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[85vh] rounded-t-xl bg-white border-none border-t-0 flex flex-col p-0 overflow-hidden outline-none [&>div:first-child]:hidden">
          <div className="mx-auto mt-3 h-1.5 w-24 shrink-0 rounded-full bg-gray-300 mb-2" />
          <ProfileInfo />

        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-md p-0"
      >
        <ProfileInfo />
      </SheetContent>
    </Sheet>
  );
}