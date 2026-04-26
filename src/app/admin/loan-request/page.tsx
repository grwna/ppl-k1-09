import React from "react";
import { getAllLoanApplications, getAvailableDonorBalance } from "@/services/loan-approval.service";
import LoanRequestsClient from "@/components/ui/admin-dashboard/loan-requests-client";
import { auth } from "@/auth";

export default async function LoanRequestsPage() {
  const session = await auth();
  const applications = await getAllLoanApplications();
  const availableBalance = await getAvailableDonorBalance();
  const adminId = session?.user?.id || "00000000-0000-0000-0000-000000000000";

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b pb-4 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Manajemen Persetujuan Pinjaman</h1>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Saldo Tersedia</p>
            <p className="text-2xl font-black text-[#07B0C8]">Rp {availableBalance.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <LoanRequestsClient applications={applications} adminId={adminId} availableBalance={availableBalance} />
      </div>
    </div>
  );
}