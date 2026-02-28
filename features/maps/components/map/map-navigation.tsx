import { Report } from "../../interfaces/get-all-reports-bystander.interface";

interface MapNavigationProps {
  onMenuClick?: () => void;
  reports: Report[]
  isResponder: boolean;
}

export function MapNavigation({ onMenuClick, reports, isResponder }: MapNavigationProps) {
  const criticalCount = reports.filter(r => r.severity?.toLowerCase() === 'critical').length;
  const highCount = reports.filter(r => r.severity?.toLowerCase() === 'high').length;
  const moderateCount = reports.filter(r => r.severity?.toLowerCase() === 'moderate').length;
  const minorCount = reports.filter(r => r.severity?.toLowerCase() === 'minor').length;
  const totalCountReports = reports.length;
  return (
    <nav className="absolute top-2 left-2 right-2 bg-white shadow-lg px-2 sm:px-3 py-2 flex items-center justify-between rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
        <div className={`flex items-center gap-1.5 pr-2 sm:pr-4 ${isResponder ? null : 'border-r border-gray-200'} shrink-0`}>
          <span className="text-sm sm:text-base font-bold">
            <span className="text-red-600">Eye</span>
            <span className="text-blue-600">SOS</span>
          </span>
        </div>

        {isResponder ? (
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden ml-1">
            <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-0.5 rounded-md shrink-0">
              <span className="text-[9px] sm:text-[10px] font-black text-white tracking-widest uppercase">
                Responder
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-[10px] sm:text-xs font-bold text-zinc-600 uppercase tracking-tight">
                On Duty
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                {totalCountReports} <span className="hidden sm:inline">Active</span>
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center gap-1 bg-red-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-red-200 shrink-0">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                <span className="text-xs font-semibold text-red-700">
                  {criticalCount}
                </span>
                <span className="text-[10px] text-red-600 hidden sm:inline">Critical</span>
              </div>
              <div className="flex items-center gap-1 bg-orange-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-orange-200 shrink-0">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                <span className="text-xs font-semibold text-orange-700">
                  {highCount}
                </span>
                <span className="text-[10px] text-orange-600 hidden sm:inline">High</span>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-yellow-200 shrink-0">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <span className="text-xs font-semibold text-yellow-700">
                  {moderateCount}
                </span>
                <span className="text-[10px] text-yellow-600 hidden sm:inline">Moderate</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-1.5 sm:px-2 py-0.5 rounded-md border border-green-200 shrink-0">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                <span className="text-xs font-semibold text-green-700">
                  {minorCount}
                </span>
                <span className="text-[10px] text-green-600 hidden sm:inline">Low</span>
              </div>
            </div>
          </div>
        )}

      </div>

      <button
        onClick={onMenuClick}
        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  );
}

