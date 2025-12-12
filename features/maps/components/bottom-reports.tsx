"use client";
import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

export default function BottomReports() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full max-w-[400px] bg-white shadow-lg px-3 py-2 rounded-lg border border-gray-200">
      <div className="space-y-2">
        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-500/30 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
          </svg>
          Request Emergency Help
        </button>

        <div className="text-center">
          <p className="text-xs text-slate-600 font-medium">Choose location method</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectedMethod('pin')}
            className={`py-2 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 text-sm ${selectedMethod === 'pin'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
          >
            <MapPin className="w-4 h-4" />
            Pin on Map
          </button>

          <button
            onClick={() => setSelectedMethod('search')}
            className={`py-2 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 text-sm ${selectedMethod === 'search'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
          >
            <Search className="w-4 h-4" />
            Search Place
          </button>
        </div>

        {selectedMethod && (
          <div className="mt-1 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 text-center">
              {selectedMethod === 'pin'
                ? '📍 Tap on the map to pin your location'
                : '🔍 Search for a specific place or address'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}