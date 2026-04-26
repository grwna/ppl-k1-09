import { Timestamp } from "next/dist/server/lib/cache-handlers/types";


export type LoanApplication = {
  loanApplicationId : string,
  name: string,
  image : string,
  idNumber: string;
  institution : string,
  intakeYear: number,
  address : string,

  // loan details
  requestedAmount: number;
  description: string;
  status: string;
  createdAt : number,
  studentIdCard : File,
  transcriptFile : File,

  // admin actions
  approvedAmount : number,
  rejectionApprovalNotes : string
}

