"use client"

import { useLoanRequestStore } from "@/hooks/loanRequestStore";
import DummyUserLogo from "../../../../../public/dummy-user.svg"
import DummyDocsLogo from "../../../../../public/dummy-docs.svg"
import ArrowRightGreyLogo from "../../../../../public/arrow-right-grey.svg"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AdminDashboard_AdminNavbar from "@/components/ui/admin-dashboard/admin_navbar";
import MapFundsModal from "@/components/ui/loan-request/fund_allocation_card";
import { FileText } from "lucide-react";

const StatusActionDict = {
    "PENDING": { "status_color": "#FEF3C6", "text_color": "#BB4D00" },
    "APPROVED": { "status_color": "#D0FAE5", "text_color": "#007A55" },
    "REJECTED": { "status_color": "#FFE2E2", "text_color": "#C10007" },
}

const formatCurrency = (val: number | string) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num).replace("IDR", "Rp");
}


// Sub-components for cleaner code
function InfoBlock({ label, value }: { label: string, value: string | number | null | undefined }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>
            <span className="font-semibold text-slate-700">{value || "—"}</span>
        </div>
    );
}

function DocumentCard({ label, file }: { label: string, file?: string | File | null }) {
    const fileUrl = typeof file === "string" ? file : "";
    const isPlaceholder = !fileUrl;
    const isPdf = fileUrl.toLowerCase().includes(".pdf") || fileUrl.toLowerCase().includes("application/pdf");

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden group hover:border-[#07B0C8] transition-colors bg-white">
            <div className="h-40 bg-gray-50 relative flex items-center justify-center">
                {isPlaceholder ? (
                    <Image src={DummyDocsLogo} alt="Placeholder" width={60} height={60} className="opacity-20" />
                ) : isPdf ? (
                    <FileText className="text-red-500" size={48} />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fileUrl} alt={label} className="h-full w-full object-cover" />
                )}
            </div>
            <div className="p-3 bg-white flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">{label}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">{isPlaceholder ? "Missing" : "Uploaded"}</span>
                </div>
                {!isPlaceholder && (
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 hover:bg-cyan-50 rounded-lg text-[#07B0C8]"
                        aria-label={`Open ${label}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </a>
                )}
            </div>
        </div>
    );
}

export default function ReviewLoanApplicationPage() {
    const selectedLoan = useLoanRequestStore((state) => state.selected_loan);
    const isAllocationFundModalOpen = useLoanRequestStore((state) => state.isAllocationFundModalOpen);
    const [actionError, setActionError] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    
    // Actions
    const setApprovedAmount = useLoanRequestStore((state) => state.setApprovedAmount);
    const setRejectionApprovalNote = useLoanRequestStore((state) => state.setRejectionApprovalNote);
    const setAllocationFundModalOpen = useLoanRequestStore((state) => state.setAllocationFundModalOpen);
    const setSelectedLoan = useLoanRequestStore((state) => state.setSelectedLoan);

    // Derived Data
    const submitTime = selectedLoan?.createdAt ? new Date(selectedLoan.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) : "Recently";
    const approvedAmount = selectedLoan?.approvedAmount || "";
    const rejectionApprovalNote = selectedLoan?.rejectionApprovalNotes || "";
    const status = (selectedLoan?.status || "PENDING").toUpperCase();
    const isPending = status === "PENDING";
    const isApproved = status === "APPROVED";
    const isRejected = status === "REJECTED";
    const approvedLoanAmount = Number(selectedLoan?.loan?.approvedAmount || selectedLoan?.approvedAmount || 0);
    const allocatedAmount = (selectedLoan?.loan?.fundings || []).reduce(
        (total, funding) => total + (Number(funding.amount) || 0),
        0
    );
    const remainingAllocation = Math.max(approvedLoanAmount - allocatedAmount, 0);
    
    // Supporting Docs Logic
    const documents = [
        { label: "KTM / ID Card", file: selectedLoan?.studentIdCard },
        { label: "Kartu Keluarga", file: selectedLoan?.transcriptFile }
    ];

    if (!selectedLoan) return <div className="p-20 text-center">Loading application data...</div>

    const handleApproveApplication = async () => {
        const applicationId = selectedLoan.id || selectedLoan.loanApplicationId;
        const amount = Number(approvedAmount);

        if (!applicationId) {
            setActionError("Application id tidak ditemukan.");
            return;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            setActionError("Jumlah disetujui harus lebih dari 0.");
            return;
        }

        if (amount > Number(selectedLoan.requestedAmount)) {
            setActionError("Jumlah disetujui tidak boleh melebihi jumlah yang diajukan.");
            return;
        }

        setIsApproving(true);
        setActionError("");

        try {
            const response = await fetch(`/api/applications/${applicationId}/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    approvedAmount: amount,
                    notes: rejectionApprovalNote || undefined,
                }),
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result.error || "Gagal menyetujui pengajuan");
            }

            setSelectedLoan({
                ...selectedLoan,
                status: "APPROVED",
                loanId: result.data.loan.id,
                loan: {
                    ...result.data.loan,
                    fundings: result.data.loan.fundings || [],
                },
                approvedAmount: Number(result.data.loan.approvedAmount || amount),
            });
        } catch (error) {
            setActionError(error instanceof Error ? error.message : "Gagal menyetujui pengajuan");
        } finally {
            setIsApproving(false);
        }
    };

    const handleRejectApplication = async () => {
        const applicationId = selectedLoan.id || selectedLoan.loanApplicationId;
        if (!applicationId) {
            setActionError("Application id tidak ditemukan.");
            return;
        }

        setIsRejecting(true);
        setActionError("");

        try {
            const response = await fetch(`/api/applications/${applicationId}/reject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    notes: rejectionApprovalNote || undefined,
                }),
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result.error || "Gagal menolak pengajuan");
            }

            setSelectedLoan({
                ...selectedLoan,
                status: "REJECTED",
            });
        } catch (error) {
            setActionError(error instanceof Error ? error.message : "Gagal menolak pengajuan");
        } finally {
            setIsRejecting(false);
        }
    };

    return (
        <div className="flex flex-col justify-start items-center w-full min-h-screen bg-[#F9FAFB] pb-20">
            {isAllocationFundModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <MapFundsModal />
                </div>
            )}

            <AdminDashboard_AdminNavbar />

            {/* Header / Breadcrumb */}
            <div className="flex flex-col w-[90%] gap-4 py-8">
                <Link href="/admin/loan-request" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors w-fit">
                    <Image src={ArrowRightGreyLogo} alt="Back" height={18} width={18} className="rotate-180" />
                    <span className="text-sm font-medium">Kembali ke daftar pengajuan pinjaman</span>
                </Link>

                <div className="flex justify-between items-end w-full">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold text-4xl text-slate-900">Tinjau Pengajuan Pinjaman</h1>
                        <p className="text-gray-500 text-sm">
                            Pengajuan {selectedLoan.loanApplicationId} • Diajukan pada {submitTime}
                        </p>
                    </div>

                    {(() => {
                        const statusKey = status as keyof typeof StatusActionDict;
                        const config = StatusActionDict[statusKey];
                        return (
                            <div className="py-2 px-6 font-bold rounded-full text-xs border" 
                                 style={{ color: config.text_color, backgroundColor: config.status_color, borderColor: config.text_color }}>
                                {status}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex justify-center items-start w-[90%] gap-6">
                
                {/* Left Column: Details */}
                <div className="flex flex-col w-[70%] gap-6">
                    
                    {/* Applicant Info Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
                        <h3 className="font-bold text-lg text-slate-800">Informasi Pengaju Pinjaman</h3>
                        
                        <div className="flex gap-8 items-start">
                            <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                <Image src={selectedLoan.image || DummyUserLogo} alt="Profile" fill className="object-cover" />
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-12 w-full">
                                <InfoBlock label="Nama Lengkap" value={selectedLoan.name} />
                                <InfoBlock label="NIM / NIP" value={selectedLoan.idNumber} />
                                <InfoBlock label="Institusi" value={selectedLoan.institution || "Institut Teknologi Bandung"} />
                                <InfoBlock label="Tahun Ajaran / Angkatan" value={selectedLoan.intakeYear || "2022"} />
                                <div className="col-span-2">
                                    <InfoBlock label="Alamat Terkini" value={selectedLoan.address || "Alamat tidak tersedia"} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Supporting Docs */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
                        <h3 className="font-bold text-lg text-slate-800">Dokumen Pendukung</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {documents.map((doc, i) => (
                                <DocumentCard key={i} label={doc.label} file={doc.file} />
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h3 className="font-bold text-lg text-slate-800">Deskripsi Pinjaman</h3>
                        <div className="p-4 bg-slate-50 rounded-xl text-slate-600 leading-relaxed text-sm italic border border-slate-100">
                            &quot;{selectedLoan.description || "Tidak ada deskripsi tambahan yang diberikan oleh pengaju."}&quot;
                        </div>
                    </div>
                </div>

                {/* Right Column: Admin Actions */}
                <div className="flex flex-col w-[30%] gap-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-4">
                    <h3 className="font-bold text-lg text-slate-800">Aksi Admin</h3>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium uppercase mb-1">Jumlah Diajukan</p>
                        <p className="text-3xl font-black text-[#07B0C8]">{formatCurrency(selectedLoan.requestedAmount)}</p>
                    </div>

                    {isPending && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Jumlah Disetujui Admin</label>
                            <input
                                type="number"
                                value={approvedAmount}
                                onChange={(e) => setApprovedAmount(Number(e.target.value))}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#07B0C8] outline-none font-bold text-lg"
                                placeholder="Masukkan nominal yang disetujui"
                                min={1}
                                max={Number(selectedLoan.requestedAmount)}
                            />
                            <p className="text-xs text-slate-400">
                                Boleh lebih kecil dari jumlah yang diajukan, maksimal {formatCurrency(selectedLoan.requestedAmount)}.
                            </p>
                        </div>
                    )}

                    {isApproved && (
                        <div className="flex flex-col gap-3">
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <p className="text-xs text-emerald-700 font-medium uppercase mb-1">Jumlah Disetujui</p>
                                <p className="text-2xl font-black text-emerald-700">{formatCurrency(approvedLoanAmount)}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <p className="text-xs text-slate-500 font-medium uppercase mb-1">Sudah Dialokasikan</p>
                                    <p className="text-xl font-black text-slate-800">{formatCurrency(allocatedAmount)}</p>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                    <p className="text-xs text-amber-700 font-medium uppercase mb-1">Sisa Belum Dialokasikan</p>
                                    <p className="text-xl font-black text-amber-700">{formatCurrency(remainingAllocation)}</p>
                                </div>
                            </div>
                            {(selectedLoan.loan?.fundings || []).length > 0 && (
                                <div className="rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="px-4 py-3 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                                        Riwayat Alokasi
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {(selectedLoan.loan?.fundings || []).map((funding) => (
                                            <div key={funding.id} className="px-4 py-3 text-sm flex justify-between gap-3">
                                                <span className="text-slate-500 truncate">
                                                    {funding.donorFund?.donor?.name || funding.sourceType}
                                                </span>
                                                <span className="font-bold text-slate-800 whitespace-nowrap">
                                                    {formatCurrency(funding.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {(isPending || isRejected) && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Catatan Keputusan</label>
                        <textarea
                            value={rejectionApprovalNote}
                            onChange={(e) => setRejectionApprovalNote(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#07B0C8] outline-none min-h-[120px] text-sm"
                            placeholder="Berikan alasan atau catatan tambahan..."
                        />
                    </div>
                    )}

                    <div className="flex flex-col gap-3 mt-4">
                        {actionError && (
                            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {actionError}
                            </p>
                        )}
                        {isPending && (
                            <>
                                <button
                                    onClick={handleApproveApplication}
                                    disabled={isApproving || isRejecting}
                                    className="w-full py-4 bg-[#07B0C8] hover:bg-[#06a0b5] text-white font-bold rounded-xl transition-all shadow-md shadow-cyan-100 disabled:opacity-50"
                                >
                                    {isApproving ? "Menyetujui..." : "Setujui Pinjaman"}
                                </button>
                                <button
                                    onClick={handleRejectApplication}
                                    disabled={isRejecting || isApproving}
                                    className="w-full py-4 border-2 border-red-100 text-red-500 hover:bg-red-50 font-bold rounded-xl transition-all disabled:opacity-50"
                                >
                                    {isRejecting ? "Menolak..." : "Tolak Pengajuan"}
                                </button>
                            </>
                        )}

                        {isApproved && (
                            <button
                                onClick={() => {
                                    setActionError("");
                                    setAllocationFundModalOpen(true);
                                }}
                                disabled={remainingAllocation <= 0}
                                className="w-full py-4 bg-[#07B0C8] hover:bg-[#06a0b5] text-white font-bold rounded-xl transition-all shadow-md shadow-cyan-100 disabled:opacity-50"
                            >
                                {remainingAllocation <= 0 ? "Dana Sudah Terpenuhi" : "Allocate / Map Funds"}
                            </button>
                        )}

                        {isRejected && (
                            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                Pengajuan ini sudah ditolak. Tidak ada aksi lanjutan.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
