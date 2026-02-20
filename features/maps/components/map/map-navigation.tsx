import { Report } from "../../interfaces/get-all-reports-bystander.interface";

interface MapNavigationProps {
  onMenuClick: () => void;
  reports: Report[]
}

export function MapNavigation({ onMenuClick, reports }: MapNavigationProps) {
  const criticalCount = reports.filter(r => r.severity?.toLowerCase() === 'critical').length;
  const highCount = reports.filter(r => r.severity?.toLowerCase() === 'high').length;
  const moderateCount = reports.filter(r => r.severity?.toLowerCase() === 'moderate').length;
  const minorCount = reports.filter(r => r.severity?.toLowerCase() === 'minor').length;
  const totalCountReports = reports.length;
  return (
    <nav className="absolute top-2 left-2 right-2 bg-white shadow-lg px-3 py-2 flex items-center justify-between rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 pr-4 border-r border-gray-200">
          <span className="text-base font-bold">
            <span className="text-red-600">Eye</span>
            <span className="text-blue-600">SOS</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-gray-700">
              {totalCountReports} Active
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
              <span className="text-xs font-semibold text-red-700">
                {criticalCount}
              </span>
              <span className="text-[10px] text-red-600">Critical</span>
            </div>
            <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
              <span className="text-xs font-semibold text-orange-700">
                {highCount}
              </span>
              <span className="text-[10px] text-orange-600">High</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-200">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              <span className="text-xs font-semibold text-yellow-700">
                {moderateCount}
              </span>
              <span className="text-[10px] text-yellow-600">Moderate</span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              <span className="text-xs font-semibold text-green-700">
                {minorCount}
              </span>
              <span className="text-[10px] text-green-600">Low</span>
            </div>
          </div>
        </div>
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

