"use client"

import { useLoanRequestStore } from "@/hooks/loanRequestStore";
import { useEffect, useState } from "react";
import LoanRequest_LoanRequestsTable from "@/components/ui/loan-request/loan_request_table";
import AdminDashboard_AdminNavbar from "@/components/ui/admin-dashboard/admin_navbar";

export default function AdminLoanRequestPage() {
  const maxItemsInPage = 10;

  const loans = useLoanRequestStore((state) => state.loans);
  const setLoans = useLoanRequestStore((state) => state.setLoans);

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const totalItems = loans.length || 0;
  const maxPageNumber = Math.max(1, Math.ceil(totalItems / maxItemsInPage));

  useEffect(() => {
    const fetchLoanApplication = async () => {
      setIsLoading(true);
      const baseUrl = '/api/loans';
      const start = (currentPageNumber - 1) * maxItemsInPage;
      const end = start + maxItemsInPage;

      const params = new URLSearchParams({
        start: start.toString(),
        end: end.toString(),
      });

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      try {
        const response = await fetch(`${baseUrl}?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        setLoans(result.data.loans || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanApplication();
  }, [currentPageNumber, statusFilter, setLoans]);

  const handleFilterChange = (status: string | undefined) => {
    setStatusFilter(status);
    setCurrentPageNumber(1);
  };

  // Helper to determine the active tab color based on your dict
  const getTabColor = (value: string | undefined) => {
    if (statusFilter !== value) return "text-gray-500"; // Inactive color

    switch (value) {
      case "PENDING": return "text-[#BB4D00] border-[#BB4D00]";
      case "APPROVED": return "text-[#007A55] border-[#007A55]";
      case "REJECTED": return "text-[#C10007] border-[#C10007]";
      default: return "text-[#00B5D8] border-[#00B5D8]"; // "All" color
    }
  };

  return (
    <div className="flex flex-col justify-start items-center w-full min-h-screen bg-[#F9FAFB]">
      <AdminDashboard_AdminNavbar />

      <div className="w-[90%] pt-10 pb-4">
        <h1 className="text-4xl font-bold text-[#1E293B]">Daftar Pengajuan Pinjaman</h1>
        <p className="text-lg text-gray-500 mt-2">
          Atur dan review pengajuan pinjaman oleh mahasiswa dan dosen.
        </p>
      </div>

      <div className="flex flex-col w-[90%] py-4">
        {/* Filter Tabs with Hardcoded Dictionary Colors */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {[
            { label: "All", value: undefined },
            { label: "Pending", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleFilterChange(tab.value)}
              className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${getTabColor(tab.value)} ${statusFilter !== tab.value ? "border-transparent hover:text-gray-700" : ""
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full mb-6">
          <LoanRequest_LoanRequestsTable isLoading={isLoading} />
        </div>

        {/* Pagination UI */}
        <div className="flex justify-between items-center w-full py-4 bg-white px-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 font-medium">
            {totalItems === 0 ? (
              "No data to show"
            ) : (
              <>
                Showing <span className="text-slate-900 font-bold">{((currentPageNumber - 1) * maxItemsInPage) + 1}</span> to{" "}
                <span className="text-slate-900 font-bold">{Math.min(currentPageNumber * maxItemsInPage, totalItems)}</span> of{" "}
                <span className="text-slate-900 font-bold">{totalItems}</span> items
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPageNumber === 1}
              onClick={() => setCurrentPageNumber((prev) => prev - 1)}
              className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white text-sm font-bold">
              {currentPageNumber}
            </div>

            <button
              disabled={currentPageNumber >= maxPageNumber}
              onClick={() => setCurrentPageNumber((prev) => prev + 1)}
              className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}