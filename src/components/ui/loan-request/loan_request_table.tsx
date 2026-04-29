"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useLoanRequestStore } from "@/hooks/loanRequestStore"
import Image from "next/image"
import { useRouter } from "next/navigation" // Import the router
import DefaultAvatarLogo from  "../../../../public/default-avatar.svg"

// ===============================
// HELPERS
// ===============================
const StatusActionDict = {
    "PENDING": {
        "status_bg": "#FEF3C6",
        "status_text": "#BB4D00",
        "action_caption": "Review",
        "action_bg": "#E0F7FA",
        "action_text": "#00B5D8",
    },
    "APPROVED": {
        "status_bg": "#D0FAE5",
        "status_text": "#007A55",
        "action_caption": "See Detail",
        "action_bg": "#FEFCE8",
        "action_text": "#FCB82E",
    },
    "REJECTED": {
        "status_bg": "#FFE2E2",
        "status_text": "#C10007",
        "action_caption": "See Detail",
        "action_bg": "#FEFCE8",
        "action_text": "#FCB82E",
    },
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount).replace("IDR", "Rp");
};

const formatDate = (dateInput: string | number | Date) => {
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return "Tanggal tidak valid";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
    }).format(date);
};

type LoanAttachment = {
    id: string;
    documentType: string;
    fileUrl: string;
    uploadedAt: string | Date;
};

type LoanRequestRow = {
    id?: string;
    loanApplicationId?: string;
    borrower?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
    image?: string;
    idNumber?: string;
    institution?: string;
    intakeYear?: number;
    address?: string;
    requestedAmount: number | string;
    description?: string | null;
    collateralDescription?: string | null;
    status?: string;
    createdAt: string | number | Date;
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
    attachments?: LoanAttachment[];
    approvedAmount?: number;
    rejectionApprovalNotes?: string;
};

// ===============================
// COMPONENT
// ===============================
export default function LoanRequest_LoanRequestsTable({ isLoading = false }: { isLoading?: boolean }) {
    const router = useRouter(); // Initialize router
    const loans = useLoanRequestStore((state) => state.loans);
    const setSelectedLoan = useLoanRequestStore((state) => state.setSelectedLoan);

    // Wrapper function to handle both actions
    const handleActionClick = (loan: LoanRequestRow) => {
        const studentIdAttachment = loan.attachments?.find((attachment) => attachment.documentType === "student_id_card");
        const familyCardAttachment = loan.attachments?.find((attachment) => attachment.documentType === "family_card");
        const status = loan.status || "PENDING";
        const approvedAmount = status === "APPROVED"
            ? Number(loan.loan?.approvedAmount || loan.approvedAmount || 0)
            : 0;

        setSelectedLoan({
            id: loan.id,
            loanApplicationId: loan.id || loan.loanApplicationId || "",
            name: loan.borrower?.name || "—",
            image: loan.borrower?.image || "",
            idNumber: loan.borrower?.email || "—",
            institution: loan.institution || "Institut Teknologi Bandung",
            intakeYear: loan.intakeYear || 2022,
            address: loan.address || "",
            requestedAmount: Number(loan.requestedAmount),
            description: loan.description || "",
            collateralDescription: loan.collateralDescription || "",
            status,
            createdAt: loan.createdAt,
            loanId: loan.loan?.id || "",
            loan: loan.loan || null,
            attachments: loan.attachments || [],
            studentIdCard: studentIdAttachment?.fileUrl || "",
            transcriptFile: familyCardAttachment?.fileUrl || "",
            approvedAmount,
            rejectionApprovalNotes: loan.rejectionApprovalNotes || "",
        });
        router.push("/admin/loan-request/review");
    };

    if (isLoading) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 border-4 border-[#00B5D8]/20 border-t-[#00B5D8] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Memuat data pengajuan...</p>
            </div>
        );
    }

    if (!loans || loans.length === 0) {
        return <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">Tidak ada pengajuan pinjaman yang perlu diperhatikan</div>
    }

    return (
        <div className="w-full border-t border-gray-100 bg-white rounded-xl shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-[#F9FAFB]">
                    <TableRow>
                        <TableHead className="text-[#64748B] font-semibold text-xs uppercase px-6">Applicant Details</TableHead>
                        <TableHead className="text-[#64748B] font-semibold text-xs uppercase">Institution</TableHead>
                        <TableHead className="text-[#64748B] font-semibold text-xs uppercase">Requested Amount</TableHead>
                        <TableHead className="text-[#64748B] font-semibold text-xs uppercase">Date Submitted</TableHead>
                        <TableHead className="text-[#64748B] font-semibold text-xs uppercase text-center">Status</TableHead>
                        <TableHead className="text-[#64748B] font-semibold text-xs uppercase text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loans.map((loan) => {
                        const statusKey = (loan.status || "PENDING").toUpperCase() as keyof typeof StatusActionDict;
                        const config = StatusActionDict[statusKey];

                        return (
                            <TableRow key={loan.id || loan.loanApplicationId} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                                
                                {/* Applicant Details */}
                                <TableCell className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                                            <Image 
                                                src={loan.image || DefaultAvatarLogo} 
                                                alt="Profile" 
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#1E293B] text-sm">{loan.borrower?.name || "Muhammad Fithra Rizki"}</span>
                                            <span className="text-[#64748B] text-[11px] font-medium uppercase tracking-tight">
                                                REQ-2023-089 • {loan.idNumber || "13523049"}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Institution */}
                                <TableCell className="text-[#475569] text-sm font-medium">
                                    {loan.institution || "Institut Teknologi Bandung (ITB)"}
                                </TableCell>

                                {/* Requested Amount */}
                                <TableCell className="font-bold text-[#1E293B] text-sm">
                                    {formatCurrency(Number(loan.requestedAmount))}
                                </TableCell>

                                {/* Date Submitted */}
                                <TableCell className="text-[#64748B] text-sm">
                                    {formatDate(loan.createdAt)}
                                </TableCell>

                                {/* Status Pill */}
                                <TableCell>
                                    <div className="flex justify-center">
                                        <div 
                                            className="px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5"
                                            style={{ backgroundColor: config.status_bg, color: config.status_text }}
                                        >
                                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: config.status_text }}></span>
                                            {loan.status}
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Action Button */}
                                <TableCell>
                                    <div className="flex justify-center">
                                        <button 
                                            onClick={() => handleActionClick(loan)}
                                            className="px-5 py-1.5 rounded-lg text-xs font-bold transition-all hover:brightness-95 active:scale-95 shadow-sm"
                                            style={{ backgroundColor: config.action_bg, color: config.action_text }}
                                        >
                                            {config.action_caption}
                                        </button>
                                    </div>
                                </TableCell>

                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
