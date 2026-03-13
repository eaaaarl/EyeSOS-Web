"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sunset, Sunrise, SunIcon, Moon } from "lucide-react"

export function IncidentsByTimePeriod() {
  return (
    <Card className="border-l-4 border-l-blue-500 h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-6">
          <div className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-rose-500" strokeWidth={3} />
            <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-700">
              By Time Period
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 w-28">
              <Sunrise className="w-5 h-5 text-orange-400" fill="currentColor" />
              <span className="text-sm text-slate-700">Morning</span>
            </div>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[31%] relative opacity-90"></div>
            </div>
            <div className="w-20 flex justify-end items-center gap-4">
              <span className="font-bold text-slate-800">20</span>
              <span className="text-sm text-slate-500 w-8">31%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 w-28">
              <Sunset className="w-5 h-5 text-purple-400" fill="currentColor" />
              <span className="text-sm text-slate-700">Evening</span>
            </div>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[30%] relative opacity-90"></div>
            </div>
            <div className="w-20 flex justify-end items-center gap-4">
              <span className="font-bold text-slate-800">19</span>
              <span className="text-sm text-slate-500 w-8">30%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 w-28">
              <SunIcon className="w-5 h-5 text-amber-500" fill="currentColor" />
              <span className="text-sm text-slate-700">Afternoon</span>
            </div>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[27%] relative opacity-90"></div>
            </div>
            <div className="w-20 flex justify-end items-center gap-4">
              <span className="font-bold text-slate-800">17</span>
              <span className="text-sm text-slate-500 w-8">27%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 w-28">
              <Moon className="w-5 h-5 text-yellow-500" fill="currentColor" />
              <span className="text-sm text-slate-700">Night</span>
            </div>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[13%] relative opacity-90"></div>
            </div>
            <div className="w-20 flex justify-end items-center gap-4">
              <span className="font-bold text-slate-800">8</span>
              <span className="text-sm text-slate-500 w-8">13%</span>
            </div>
          </div>

        </CardContent>
      </div>
      
      <div className="p-4 mx-6 mb-6 mt-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed shadow-sm">
        <span className="inline-block mr-2 scale-110">🏍️</span>
        <span className="font-extrabold text-[#ef4444]">28.1%</span> of incidents involved <span className="font-bold text-[#f97316]">motorcycles only</span> — highest risk vehicle type in Lianga
      </div>
    </Card>
  )
}
