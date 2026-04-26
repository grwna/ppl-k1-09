"use client"

import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"
import { useAdminDashboardStore } from "@/hooks/adminDashboardStore"

// ===============================
// HELPERS
// ===============================
const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)

const timeAgo = (date: Date) => {
  const now = new Date()
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`
}

// ===============================
// COMPONENT
// ===============================
export default function AdminDashboard_RecentActivityTable() {
  const pendingLogs = useAdminDashboardStore((state) => state.pending_logs)

  if (!pendingLogs) return null

  const items = pendingLogs.pendingRequests.slice(0, 5)

  if (items.length === 0) {
    return (
      <div className="w-full py-10 flex flex-col items-center justify-center text-gray-400">
        <FileText className="w-8 h-8 mb-2 opacity-40" />
        <p className="text-sm">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_120px_140px] gap-4 px-4 pb-2 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Activity</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Time</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Amount</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_120px_140px] gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors"
          >
            {/* Activity */}
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-500" />
              </span>
              <span className="text-sm text-gray-700 font-medium leading-snug">
                New Application Submitted from{" "}
                <span className="text-gray-900">{item.borrower.name}</span>
              </span>
            </div>

            {/* Time */}
            <span className="text-sm text-gray-400">{timeAgo(item.requestedAt)}</span>

            {/* Amount */}
            <span className="text-sm font-semibold text-orange-500 text-right">
              {formatRupiah(item.requestedAmount)}
            </span>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-center pt-4 pb-1 border-t border-gray-100 mt-2">
        <Link
          href="/admin/loan-request"
          className="flex items-center gap-1 text-sm font-medium text-[#07B0C8] hover:text-cyan-700 transition-colors"
        >
          View All Activities
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
