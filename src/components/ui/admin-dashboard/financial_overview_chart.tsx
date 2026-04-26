"use client"

import { ChartContainer, type ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, XAxis, YAxis, Legend, Bar, BarChart } from "recharts"
import { useAdminDashboardStore } from "@/hooks/adminDashboardStore"

export default function AdminDashboard_FinancialOverviewChart() {
  const analytics = useAdminDashboardStore((state) => state.analytics)

  // ===============================
  // SAFETY GUARD
  // ===============================
  if (!analytics) return null

  // ===============================
  // MERGE DATA
  // ===============================
  const map = new Map<string, { month: string; donations: number; disbursement: number }>()

  // donations
  analytics.monthlyDonations.forEach((item) => {
    map.set(item.month, {
      month: item.month,
      donations: item.total,
      disbursement: 0,
    })
  })

  // disbursement
  analytics.monthlyDisbursement.forEach((item) => {
    if (map.has(item.month)) {
      map.get(item.month)!.disbursement = item.total
    } else {
      map.set(item.month, {
        month: item.month,
        donations: 0,
        disbursement: item.total,
      })
    }
  })

  const chartData = Array.from(map.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  )

  // ===============================
  // CONFIG
  // ===============================
  const chartConfig = {
    donations: {
      label: "Donations",
      color: "#16a34a",
    },
    disbursement: {
      label: "Disbursement",
      color: "#2563eb",
    },
  } satisfies ChartConfig

  return (
    <div className="flex justify-center items-center w-[80%] max-h-[50%]">
      <ChartContainer config={chartConfig} className="w-full h-[350px]">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />

          <ChartTooltip content={<ChartTooltipContent />} />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
          />

          <Bar
            dataKey="donations"
            fill={chartConfig.donations.color}
            radius={[6, 6, 0, 0]}
            barSize={20}
          />

          <Bar
            dataKey="disbursement"
            fill={chartConfig.disbursement.color}
            radius={[6, 6, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}