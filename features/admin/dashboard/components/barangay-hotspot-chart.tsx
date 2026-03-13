"use client"

import * as React from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { MapPin } from "lucide-react"

// Simple mock data — sorted descending by count
const MOCK_DATA = [
  { barangay: "Poblacion", count: 14 },
  { barangay: "Ganayon", count: 8 },
  { barangay: "Baucawe", count: 7 },
  { barangay: "Payasan", count: 6 },
  { barangay: "Saint Christine", count: 6 },
  { barangay: "Banahao", count: 6 },
  { barangay: "Anibongan", count: 6 },
  { barangay: "Liatimco", count: 3 },
  { barangay: "Diatagon", count: 3 },
  { barangay: "Manyayay", count: 2 },
  { barangay: "San Isidro", count: 2 },
  { barangay: "Ban-As", count: 1 },
  { barangay: "San Pedro", count: 1 },
]

const totalIncidents = MOCK_DATA.reduce((acc, curr) => acc + curr.count, 0)

// Gradient colors from warm (high) to cool (low)
const BAR_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f97316",
  "#f59e0b", // amber
  "#f59e0b",
  "#eab308", // yellow
  "#eab308",
  "#3b82f6", // blue
  "#3b82f6",
  "#3b82f6",
  "#3b82f6",
  "#3b82f6",
  "#3b82f6",
]

const chartConfig = {
  count: {
    label: "Incidents",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function BarangayHotspotChart() {
  return (
    <Card className="border-l-4 border-l-rose-500">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-500" />
          <CardTitle className="text-base font-semibold uppercase tracking-wide">
            Barangay Hotspots
          </CardTitle>
        </div>
        <CardDescription>
          Total incidents per barangay — from all {totalIncidents} records
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <ChartContainer config={chartConfig} className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MOCK_DATA}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
              barSize={22}
            >
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 'dataMax + 2']}
              />
              <YAxis
                dataKey="barangay"
                type="category"
                tickLine={false}
                tick={{ fontSize: 13 }}
                axisLine={false}
                width={120}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                radius={[0, 8, 8, 0]}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {MOCK_DATA.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
