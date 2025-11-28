import { Report } from "../interface/get-all-reports-bystander.interface";

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
    <nav className="absolute top-4 left-4 right-4 bg-white shadow-lg px-4 py-4 flex items-center justify-between rounded-xl border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 pr-6 border-r border-gray-200">
          <span className="text-xl font-bold">
            <span className="text-red-600">Eye</span>
            <span className="text-blue-600">SOS</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">
              {totalCountReports} Active Cases
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-sm font-semibold text-red-700">
                {criticalCount}
              </span>
              <span className="text-xs text-red-600">Critical</span>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              <span className="text-sm font-semibold text-orange-700">
                {highCount}
              </span>
              <span className="text-xs text-orange-600">High</span>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-semibold text-yellow-700">
                {moderateCount}
              </span>
              <span className="text-xs text-yellow-600">Moderate</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-sm font-semibold text-green-700">
                {minorCount}
              </span>
              <span className="text-xs text-green-600">Low</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  );
}

