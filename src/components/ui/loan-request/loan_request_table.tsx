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
import { useLoanRequestStore } from "@/hooks/loanRequestStore"
import Image from "next/image"
import Link from "next/link"

// ===============================
// HELPERS
// ===============================
const StatusActionDict = {
    "PENDING" : {
        "status_color" : "#FEF3C6",
        "text_color" : "#BB4D00",
        "action_caption" : "Review",
        "action_color" : "#00B5D8",
        "action_caption_color" : "#00B5D8",
        // "path" : "/admin/loan"
    },
    "APPROVED" : {
        "status_color" : "#D0FAE5",
        "text_color" : "#007A55",
        "action_caption" : "See Detail",
        "action_color" : "#FCB82E",
        "action_caption_color" : "#FCB82E",
        // "path" : "/admin/loan-reque/st/review"
    },
    "REJECTED" : {
        "status_color" : "#FFE2E2",
        "text_color" : "#C10007",
        "action_caption" : "See Detail",
        "action_color" : "#FCB82E",
        "action_caption_color" : "#FCB82E",
        // "path" : '/admin/loan-request/review'
    },
}


// ===============================
// COMPONENT
// ===============================
export default function LoanRequest_LoanRequestsTable() {
    const loans = useLoanRequestStore((state) => (state.loans))
    const selectedLoan = useLoanRequestStore((state) => (state.selected_loan))
    const submitTime = new Date(Date.now() - Number(selectedLoan?.createdAt)).toLocaleString()

  if (!loans) return <div>Tidak ada pengajuan pinjaman yang perlu diperhatikan</div>

  return (
    <Table>
      {/* <TableCaption>Pending loan applications</TableCaption> */}

      <TableHeader>
        <TableRow>
          <TableHead>Applicant Details</TableHead>
          <TableHead>Institution</TableHead>
          <TableHead>Requested Amount</TableHead>
          <TableHead>Date Submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.loanApplicationId}>

            {/* applicant details */}
            <TableCell className="font-medium">
                {/* section for image + its details */}
                <div className="flex h-fit">

                    {/* image */}
                    <div>
                        <Image 
                            src={loan.image}
                            alt="User profile image"
                        />
                    </div>

                    {/* name + application id */}
                    <div>

                        {/* name content */}
                        <div>
                            {selectedLoan.name}
                        </div>

                        {/* application id + nim */}
                        <div>
                            {selectedLoan.loanApplicationId} &bull; {selectedLoan.idNumber}
                        </div>

                    </div>

                </div>
            </TableCell>

            {/* institution */}
            <TableCell>{selectedLoan.institution}</TableCell>

            {/* request amount */}
            <TableCell>{selectedLoan.requestedAmount}</TableCell>

            {/* date submitted */}
            <TableCell>{submitTime}</TableCell>

            {/* status */}
            <TableCell className={`p-2 flex justify-center items-center`} 
                style={{ color: `${StatusActionDict[selectedLoan.status.toUpperCase() as keyof typeof StatusActionDict]["status_color"]}` }}
            >
                <div>
                    {selectedLoan.status}
                </div>
            </TableCell>

            {/* action */}
            <TableCell className="p-2 flex justify-center items-center ">
                <Link href={"/admin/loan-request/review"}></Link>
                <div>
                    {StatusActionDict[selectedLoan.status.toUpperCase() as keyof typeof StatusActionDict]["action_caption"]}
                </div>
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}