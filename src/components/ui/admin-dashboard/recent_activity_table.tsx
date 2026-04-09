"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAdminDashboardStore } from "@/hooks/adminDashboardStore"

// ===============================
// HELPERS
// ===============================
const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount)

const timeAgo = (date: Date) => {
  const now = new Date()
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

// ===============================
// COMPONENT
// ===============================
export default function AdminDashboard_RecentActivityTable() {
  const pendingLogs = useAdminDashboardStore((state) => state.pending_logs)

  if (!pendingLogs) return null

  return (
    <Table>
      <TableCaption>Pending loan applications</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead>Activity</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {pendingLogs.pendingRequests.map((item) => (
          <TableRow key={item.id}>
            {/* Activity */}
            <TableCell className="font-medium">
              {item.borrower.name} applied for a loan
            </TableCell>

            {/* Time */}
            <TableCell>{timeAgo(item.requestedAt)}</TableCell>

            {/* Amount */}
            <TableCell className="text-right text-orange-600">
              {formatRupiah(item.requestedAmount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}