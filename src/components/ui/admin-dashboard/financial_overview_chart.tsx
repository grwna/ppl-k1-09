
"use client"

import { ChartContainer, type ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, XAxis, YAxis, Legend } from "recharts"

import { Bar, BarChart } from "recharts"

export default function AdminDashboard_FinancialOverviewChart(){

    const chartData = [
        { month: "January", desktop: 180, mobile: 75 },
        { month: "February", desktop: 220, mobile: 95 },
        { month: "March", desktop: 260, mobile: 120 },
        { month: "April", desktop: 240, mobile: 140 },
        { month: "May", desktop: 280, mobile: 160 },
        { month: "June", desktop: 300, mobile: 180 },
        { month: "July", desktop: 320, mobile: 200 },
        { month: "August", desktop: 310, mobile: 210 },
        { month: "September", desktop: 290, mobile: 190 },
        { month: "October", desktop: 330, mobile: 220 },
        { month: "November", desktop: 360, mobile: 250 },
        { month: "December", desktop: 400, mobile: 280 },
    ]

    const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
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
                    {/* subtle grid */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    {/* axes */}
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

                    {/* tooltip */}
                    <ChartTooltip
                    content={<ChartTooltipContent />}
                    />

                    {/* legend */}
                    <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    />

                    {/* bars */}
                    <Bar
                    dataKey="desktop"
                    fill={chartConfig.desktop.color}
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                    />
                    <Bar
                    dataKey="mobile"
                    fill={chartConfig.mobile.color}
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                    />
                </BarChart>
                </ChartContainer>
        </div>
    );
}