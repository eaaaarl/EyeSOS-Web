"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setClearUserSession } from "@/lib/redux/state/authSlice";
import { useGetUserProfileQuery } from "@/features/auth/api/authApi";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Phone, Calendar, Shield, Edit, Settings, Activity, Clock } from "lucide-react";
import { useState } from "react";

interface ProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSheet({ isOpen, onOpenChange }: ProfileSheetProps) {
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
  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <div className="relative">
          <div className="h-18 bg-linear-to-br from-red-600 via-red-500 to-orange-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-4 left-4">
              <Activity className="w-6 h-6 text-white/80" />
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-linear-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                    {userInitials}
                  </div>
                )}
              </div>
              <button className="absolute bottom-2 right-2 w-9 h-9 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-colors">
                <Edit className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-20 px-6 pb-6">
          <SheetHeader className="text-center space-y-2 mb-6">
            <SheetTitle className="text-2xl font-bold text-gray-900">{userName}</SheetTitle>
            <SheetDescription className="text-sm text-gray-500">
              Responder since {memberSince}
            </SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-3">Loading profile...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-semibold text-red-600 uppercase">Status</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">Active</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-600 uppercase">Ready</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">On Duty</p>
                </div>
              </div>

              {/* Response Stats */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-semibold text-gray-700">Response Activity</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-600 mt-1">Total Responses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-600 mt-1">This Month</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-xs text-gray-600 mt-1">Avg. Time</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Information
                </h3>

                <div className="space-y-2">
                  <div className="group bg-white hover:bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-red-300 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 mb-1">Email Address</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white hover:bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-red-300 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 mb-1">Phone Number</p>
                          <p className="text-sm font-medium text-gray-900">{userPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-11 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Button>

                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2 h-11 bg-red-600 hover:bg-red-700"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}