export type LoanApplication = {
  id?: string,
  loanApplicationId : string,
  name: string,
  image : string,
  idNumber: string;
  borrower?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  institution : string,
  intakeYear: number,
  address : string,

  // loan details
  requestedAmount: number;
  description: string;
  collateralDescription?: string;
  status: string;
  createdAt : string | number | Date,
  loanId?: string;
  loan?: {
    id: string;
    approvedAmount: string | number;
    status: string;
    fundings?: {
      id: string;
      amount: string | number;
      donorFundId: string | null;
      sourceType: string;
      donorFund?: {
        donor?: {
          name?: string | null;
          email?: string | null;
        } | null;
      } | null;
    }[];
  } | null;
  attachments?: {
    id: string;
    documentType: string;
    fileUrl: string;
    uploadedAt: string | Date;
  }[];
  studentIdCard : File | string,
  transcriptFile : File | string,

  // admin actions
  approvedAmount : number,
  rejectionApprovalNotes : string
}
