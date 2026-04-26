
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DistributionRow = {
  id: string
  date: string
  programName: string
  amount: string
  status: "Pending" | "Distributed"
}

type DonorDashboardRecentDistributionTableProps = {
  rows: DistributionRow[]
  isLoading?: boolean
}

const statusClassName: Record<DistributionRow["status"], string> = {
  Pending: "bg-[#F3A71A] text-white",
  Distributed: "bg-[#10B981] text-white",
}

export default function DonorDashboard_RecentDistributionTable({
  rows,
  isLoading = false,
}: DonorDashboardRecentDistributionTableProps) {
  const tableRows = rows.slice(0, 5)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-[0_3px_10px_-8px_rgba(17,24,39,0.18)] md:p-5">
      <h2 className="mb-3 text-[2rem] font-semibold leading-none tracking-tight text-[#111827] md:text-[2.1rem]">Recent Distributions</h2>

      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#E6EBEF]">
            <TableHead className="h-9 px-2 text-[12px] font-medium text-[#6B7280] md:px-3">Date</TableHead>
            <TableHead className="h-9 px-2 text-[12px] font-medium text-[#6B7280] md:px-3">Program Name</TableHead>
            <TableHead className="h-9 px-2 text-[12px] font-medium text-[#6B7280] md:px-3">Amount</TableHead>
            <TableHead className="h-9 px-2 text-[12px] font-medium text-[#6B7280] md:px-3">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="px-2 py-8 text-center text-[13px] text-[#6B7280]">
                Loading distributions...
              </TableCell>
            </TableRow>
          ) : tableRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="px-2 py-8 text-center text-[13px] text-[#6B7280]">
                Belum ada distribusi terbaru.
              </TableCell>
            </TableRow>
          ) : (
            tableRows.map((row) => (
              <TableRow key={row.id} className="border-b border-[#EEF2F6] last:border-0">
                <TableCell className="px-2 py-3 text-[13px] text-[#111827] md:px-3">{row.date}</TableCell>
                <TableCell className="max-w-[240px] px-2 py-3 text-[13px] text-[#111827] md:px-3">
                  <span className="block truncate" title={row.programName}>{row.programName}</span>
                </TableCell>
                <TableCell className="px-2 py-3 text-[13px] text-[#111827] md:px-3">{row.amount}</TableCell>
                <TableCell className="px-2 py-3 md:px-3">
                  <span className={`inline-flex rounded-full px-2 py-[3px] text-[11px] font-semibold leading-none ${statusClassName[row.status]}`}>
                    {row.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
