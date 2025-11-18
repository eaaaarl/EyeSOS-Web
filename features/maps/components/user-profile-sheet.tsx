import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserGetProfileQueryResponse } from "@/features/auth/api/interface";
import { supabase } from "@/lib/supabase";

interface UserProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profile?: UserGetProfileQueryResponse
}

export function UserProfileSheet({ isOpen, onOpenChange, profile }: UserProfileSheetProps) {

  console.log('profile', profile)
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>
            Response team member information and settings
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto flex-1 px-4">
          {/* Profile Section */}
          <div className="flex items-center gap-4 p-4 bg-linear-to-r from-blue-50 to-red-50 rounded-lg border border-gray-200">
            <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{profile?.profile.name}</h3>
              <p className="text-sm text-gray-600">Response Team Lead</p>
              <p className="text-xs text-gray-500 mt-1">ID: {profile?.profile.id}</p>
            </div>
          </div>

          {/* Role & Organization */}
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-1">ORGANIZATION</p>
              <p className="text-sm text-blue-700">MDRRMC - Davao City</p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-green-900 mb-1">UNIT</p>
              <p className="text-sm text-green-700">BLGU Emergency Response Unit</p>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs font-semibold text-orange-900 mb-1">STATUS</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-orange-700 font-semibold">On Duty</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>{profile?.profile.mobileNo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>{profile?.profile.email}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Response Statistics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">47</p>
                <p className="text-xs text-gray-600 mt-1">Cases Handled</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">98%</p>
                <p className="text-xs text-gray-600 mt-1">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-200 pt-4 mb-4">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
              Settings
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
              View All Reports
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              Logout
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

