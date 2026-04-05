import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const activities = [
  {
    id: "1",
    activity: "New Donation of Rp 1,000,000,000 from Fajar Kurniawan",
    time: "2 hours ago",
    amount: "+Rp 1,000,000,000",
    type: "income",
  },
  {
    id: "2",
    activity: "Loan #12 Approved for Muhammad Fithra Rizki",
    time: "4 hours ago",
    amount: "-Rp 50,000,000",
    type: "expense",
  },
  {
    id: "3",
    activity: "New Application Submitted from Felix Chandra",
    time: "5 hours ago",
    amount: "—",
    type: "neutral",
  },
  {
    id: "4",
    activity: "Loan #8 Disbursement Completed",
    time: "1 day ago",
    amount: "-Rp 25,000,000",
    type: "expense",
  },
  {
    id: "5",
    activity: "Payment Reminder Sent to Loan #45",
    time: "1 day ago",
    amount: "—",
    type: "neutral",
  },
]

export default function AdminDashboard_RecentActivityTable() {
  return (
    <Table>
      <TableCaption>A list of your recent activities.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Activity</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.activity}</TableCell>
            <TableCell>{item.time}</TableCell>
            <TableCell 
              className={`text-right ${
                item.type === "income" ? "text-green-600" : ""
              }`}
            >
              {item.amount}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}