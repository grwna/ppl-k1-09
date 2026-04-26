"use client"

import { ChartContainer, type ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, XAxis, YAxis, Bar, BarChart, ResponsiveContainer } from "recharts"
import { useAdminDashboardStore } from "@/hooks/adminDashboardStore"

// ===============================
// HELPERS
// ===============================
const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
}

const formatMonthLabel = (yyyyMM: string) => {
  const parts = yyyyMM.split("-")
  return MONTH_LABELS[parts[1]] ?? yyyyMM
}

const formatYAxis = (value: number): string => {
  if (value === 0) return "Rp 0"
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`
  if (value >= 1_000_000) return `Rp ${Math.round(value / 1_000_000)}Jt`
  if (value >= 1_000) return `Rp ${Math.round(value / 1_000)}rb`
  return `Rp ${value}`
}

const formatTooltipValue = (value: number): string =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value)

// ===============================
// MAIN COMPONENT
// ===============================
export default function AdminDashboard_FinancialOverviewChart() {
  const analytics = useAdminDashboardStore((state) => state.analytics)

  if (!analytics) return null

  // ---- MERGE DATA ----
  const map = new Map<string, { month: string; label: string; donations: number; disbursement: number }>()

  analytics.monthlyDonations.forEach((item) => {
    map.set(item.month, {
      month: item.month,
      label: formatMonthLabel(item.month),
      donations: item.total,
      disbursement: 0,
    })
  })

  analytics.monthlyDisbursement.forEach((item) => {
    if (map.has(item.month)) {
      map.get(item.month)!.disbursement = item.total
    } else {
      map.set(item.month, {
        month: item.month,
        label: formatMonthLabel(item.month),
        donations: 0,
        disbursement: item.total,
      })
    }
  })

  // Sort chronologically and take last 12 months max
  const allMonths = Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month))
  const chartData = allMonths.length > 12 ? allMonths.slice(allMonths.length - 12) : allMonths

  // ---- SMART UX: Dynamic bar sizing based on number of data points ----
  const count = chartData.length
  let barSize: number
  let barGap: number

  if (count <= 2) {
    barSize = 60
    barGap = 16
  } else if (count <= 5) {
    barSize = 40
    barGap = 12
  } else if (count <= 8) {
    barSize = 28
    barGap = 8
  } else {
    barSize = 20
    barGap = 6
  }

  // ---- RANGE LABEL ----
  const rangeLabel =
    count < 12 && count > 0
      ? `Showing ${count} month${count > 1 ? "s" : ""} of data (${formatMonthLabel(chartData[0].month)} – ${formatMonthLabel(chartData[count - 1].month)})`
      : null

  // ---- CONFIG ----
  const chartConfig = {
    donations: {
      label: "Monthly Donations",
      color: "#07B0C8",
    },
    disbursement: {
      label: "Monthly Disbursements",
      color: "#FCB82E",
    },
  } satisfies ChartConfig

  return (
    <div className="w-full">
      {/* Range note for partial-year data */}
      {rangeLabel && (
        <p className="text-xs text-gray-400 mb-2 text-center italic">{rangeLabel}</p>
      )}

      <ChartContainer config={chartConfig} className="w-full h-[320px]">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 16, left: 10, bottom: 5 }}
          barGap={barGap}
          barCategoryGap={count <= 4 ? "35%" : "20%"}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatYAxis}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            width={70}
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => [
                  formatTooltipValue(value as number),
                  name === "donations" ? "Monthly Donations" : "Monthly Disbursements",
                ]}
              />
            }
          />

          <Bar
            dataKey="donations"
            fill={chartConfig.donations.color}
            radius={[5, 5, 0, 0]}
            barSize={barSize}
          />

          <Bar
            dataKey="disbursement"
            fill={chartConfig.disbursement.color}
            radius={[5, 5, 0, 0]}
            barSize={barSize}
          />
        </BarChart>
      </ChartContainer>

      {/* Legend */}
      <div className="flex justify-center items-center gap-6 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig.donations.color }} />
          <span className="text-xs text-gray-500">{chartConfig.donations.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig.disbursement.color }} />
          <span className="text-xs text-gray-500">{chartConfig.disbursement.label}</span>
        </div>
      </div>
    </div>
  )
}
