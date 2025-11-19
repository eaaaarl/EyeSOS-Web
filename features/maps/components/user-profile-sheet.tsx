import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserGetProfileQueryResponse } from "@/features/auth/api/interface";
import { supabase } from "@/lib/supabase";

interface UserProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profile?: UserGetProfileQueryResponse
}

export function UserProfileSheet({ isOpen, onOpenChange, profile }: UserProfileSheetProps) {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>
            Response team member information and organizational details
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto flex-1 px-4">
          <div className="flex items-center gap-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
            <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
              {getInitials(profile?.profile.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg truncate">{profile?.profile.name || "User"}</h3>
              <p className="text-sm text-blue-700 font-medium">{"Response Team Member"}</p>
              <p className="text-xs text-gray-500 mt-1 font-mono">ID: {profile?.profile.id?.slice(0, 8)}...</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-bold text-emerald-900 tracking-wide">ORGANIZATION</p>
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm text-emerald-800 font-semibold">
                {"BLGU - Barangay Local Government Unit"}
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                {"Lianga, Surigao Del Sur"}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-bold text-blue-900 tracking-wide">DEPARTMENT/UNIT</p>
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-sm text-blue-800 font-semibold">
                {"Emergency Response & Disaster Risk Reduction"}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                {"Field Response Team"}
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-bold text-amber-900 tracking-wide">DUTY STATUS</p>
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                <p className="text-sm text-amber-800 font-bold">On Duty</p>
              </div>
              <p className="text-xs text-amber-700 mt-1">Available for emergency response</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Information
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-gray-700 p-2 bg-gray-50 rounded">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium">{profile?.profile.mobileNo || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 p-2 bg-gray-50 rounded">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span className="truncate">{profile?.profile.email || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Response Statistics */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Response Statistics
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg text-center border border-blue-200">
                <p className="text-2xl font-bold text-blue-700">
                  457
                </p>
                <p className="text-xs text-blue-600 mt-1 font-medium">Active Cases</p>
              </div>
              <div className="p-3 bg-linear-to-br from-green-50 to-green-100 rounded-lg text-center border border-green-200">
                <p className="text-2xl font-bold text-green-700">
                  1.2k
                </p>
                <p className="text-xs text-green-600 mt-1 font-medium">Resolved</p>
              </div>
              <div className="p-3 bg-linear-to-br from-purple-50 to-purple-100 rounded-lg text-center border border-purple-200">
                <p className="text-2xl font-bold text-purple-700">
                  8m
                </p>
                <p className="text-xs text-purple-600 mt-1 font-medium">Avg. Time</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 border-t border-gray-200 pt-4 pb-4">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2 hover:shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Account Settings
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2 hover:shadow-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View All Reports
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2 hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}