"use client"

import * as React from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CalendarDays } from "lucide-react"

const MOCK_DATA = [
  { day: "Tue", count: 3, isWeekend: false },
  { day: "Wed", count: 3, isWeekend: false },
  { day: "Thu", count: 5, isWeekend: false },
  { day: "Fri", count: 3, isWeekend: false },
  { day: "Sat", count: 3, isWeekend: true },
  { day: "Sun", count: 5, isWeekend: true },
]

export function IncidentsByDayChart() {
  return (
    <Card className="border-l-4 border-l-blue-500 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 fill-blue-500 text-white p-0.5" />
          <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-700">
            Incidents By Day Of Week
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-0 flex-1 min-h-[220px]">
        <ChartContainer config={{}} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 13 }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#64748b', fontSize: 13 }} 
                domain={[0, 8]}
              />
              <ChartTooltip 
                cursor={{ fill: 'hsl(var(--muted))' }} 
                content={<ChartTooltipContent hideLabel />} 
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1000}>
                {MOCK_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isWeekend ? "#ef4444" : "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <div className="px-6 pb-6 pt-2 flex items-center gap-4 text-sm text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
          Weekend
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
          Weekday
        </div>
      </div>
    </Card>
  )
}
