"use client"

import { useLoanRequestStore } from "@/hooks/loanRequestStore";
import { useEffect, useState } from "react";
import LoanRequest_LoanRequestsTable from "@/components/ui/loan-request/loan_request_table";
import AdminDashboard_AdminNavbar from "@/components/ui/admin-dashboard/admin_navbar";

export default function AdminLoanRequestPage() {
  const maxItemsInPage = 10;

  // Store actions and state
  const loans = useLoanRequestStore((state) => state.loans);
  const setLoans = useLoanRequestStore((state) => state.setLoans);

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // 1. Calculate Pagination Metadata
  // Note: For real total pages, your API should ideally return totalCount.
  // For now, we estimate based on the current list length.
  const totalItems = loans.length || 0;
  const maxPageNumber = Math.max(1, Math.ceil(totalItems / maxItemsInPage));

  useEffect(() => {
    const fetchLoanApplication = async () => {
      // Use http unless you have configured SSL for localhost
      const baseUrl = 'http://localhost:3000/api/loans';

      // FIX: Correct Start and End indexes
      // If Page 1: start 0, end 10
      // If Page 2: start 10, end 20
      const start = (currentPageNumber - 1) * maxItemsInPage;
      const end = start + maxItemsInPage;

      const params = new URLSearchParams({
        start: start.toString(),
        end: end.toString(),
      });

      // Only add status if it's actually defined (not "All")
      if (statusFilter) {
        params.append("status", statusFilter);
      }

      try {
        const response = await fetch(`${baseUrl}?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // Assuming your API returns { data: [...] }
        setLoans(result.data.loans || []);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchLoanApplication();

    // FIX: Add dependencies so the effect re-runs when user interacts
  }, [currentPageNumber, statusFilter, setLoans]);

  // Helper to change filter
  const handleFilterChange = (status: string | undefined) => {
    setStatusFilter(status);
    setCurrentPageNumber(1); // Reset to page 1 when filter changes
  };

  console.log(loans)

  return (
    <div className="flex flex-col justify-start items-center w-full min-h-screen bg-[#F9FAFB]">
      <AdminDashboard_AdminNavbar />

      <div className="w-[90%] pt-10 pb-4">
        <h1 className="text-4xl font-bold">Daftar Pengajuan Pinjaman</h1>
        <p className="text-lg text-gray-500 mt-2">
          Atur dan review pengajuan pinjaman oleh mahasiswa dan dosen.
        </p>
      </div>

      <div className="flex flex-col w-[90%] py-4">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-4 border-b border-gray-200">
          {[
            { label: "All", value: undefined },
            { label: "Pending", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleFilterChange(tab.value)}
              className={`pb-2 px-2 transition-all ${
                statusFilter === tab.value
                  ? "border-b-2 border-red-500 font-bold text-red-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full mb-6">
          <LoanRequest_LoanRequestsTable />
        </div>

        {/* Pagination UI */}
        <div className="flex justify-between items-center w-full py-4 bg-white px-6 rounded-xl shadow-sm">
          <div className="text-sm text-gray-500">
            {totalItems === 0 ? (
              "No data to show"
            ) : (
              <>
                Showing <b>{((currentPageNumber - 1) * maxItemsInPage) + 1}</b> to{" "}
                <b>{Math.min(currentPageNumber * maxItemsInPage, totalItems)}</b> of{" "}
                <b>{totalItems}</b> items
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              disabled={currentPageNumber === 1}
              onClick={() => setCurrentPageNumber((prev) => prev - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
            >
              Previous
            </button>
            <span className="font-bold text-gray-700">{currentPageNumber}</span>
            <button
              disabled={currentPageNumber >= maxPageNumber}
              onClick={() => setCurrentPageNumber((prev) => prev + 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}