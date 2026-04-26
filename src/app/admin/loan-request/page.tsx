"use client"

import { useLoanRequestStore } from "@/hooks/loanRequestStore";
import { useEffect, useState } from "react";
import localFont from "next/font/local";

import LoanRequest_LoanRequestsTable from "@/components/ui/loan-request/loan_request_table";
import AdminDashboard_AdminNavbar from "@/components/ui/admin-dashboard/admin_navbar";
import { LoanApplicationStatus } from "@/generated/prisma";

const plusJakartaSansFont = localFont({
  src: '../../../../public/fonts/PlusJakartaSans-VariableFont.ttf',
  display: 'swap',
});

export default function AdminLoanRequestPage() {

  // local variables
  const maxItemsInPage = 10

  const loans = useLoanRequestStore((state) => (state.loans))
  const selectedLoan = useLoanRequestStore((state) => (state.selected_loan))
 
  const setLoans = useLoanRequestStore((state) => (state.setLoans))
  const setSelectedLoan = useLoanRequestStore((state) => (state.setSelectedLoan))

  let maxPageNumber = 0
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [statusFilter, setStatusFilter] = useState<any>()

  // fetch data from loan application table
  useEffect(() => {

    const fetchLoanApplication = async () => {


      // 1. Define the base URL
      const baseUrl = 'https://localhost:3000/api/loan/requests';

      // 2. Build the query string
      const params = new URLSearchParams({
        start: (currentPageNumber * maxItemsInPage).toString(),
        end: (Math.min((currentPageNumber + 1) * maxItemsInPage, loans.length - currentPageNumber * maxItemsInPage)).toString(),
        status: statusFilter
      });

      try {
        const response = await fetch(`${baseUrl}?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setLoans(result.data)
      } catch (error) {
        console.error("Fetch error at admin/loan-request/page.tsx:", error);
      }
      
    }

    fetchLoanApplication()

    // calcuate max page number
    maxPageNumber = Math.trunc(loans.length / maxItemsInPage) + 1

  }, [])

  return (
  <div className={`${plusJakartaSansFont.className} flex flex-col justify-start items-center w-full min-h-screen bg-[#F9FAFB]`}>

    {/* navbar */}
    <div className="flex justify-center items-center w-full h-fit">
        <AdminDashboard_AdminNavbar />
    </div>

    {/* title */}
    <div className="flex justify-start items-center w-[90%] h-fit text-4xl font-bold pt-10 pb-4">
      Daftar Pengajuan Pinjaman
    </div>

    {/* caption */}
    <div className="flex justify-start items-center w-[90%] h-fit text-lg pb-4">
      Atur dan review pengajuan pinjaman oleh mahasiswa dan dosen.
    </div>

    {/* table section */}
    <div className="flex flex-col justify-start items-center w-[90%] h-fit py-4">

      {/* filter for : all, pending, approved, and rejected */}
      <div className="flex justify-start items-center w-full h-fit p-2">

        {/* all */}
        <div className={`flex justify-center items-center p-2 underline-offset-1 underline-[#ef2312]`}>
          All
        </div>

        {/* Pending */}
        <div className="flex justify-center items-center p-2">
          Pending
        </div>

        {/* approved */}
        <div className="flex justify-center items-center p-2">
          Approved
        </div>

        {/* rejected */}
        <div className="flex justify-center items-center p-2">
          Rejected
        </div>

      </div>

      {/* table of loan application that can be pressed  */}
      <div className="flex justify-center items-center p-2 w-full h-fit">
        <LoanRequest_LoanRequestsTable />
      </div>

      {/* table details : how many paging and paging buttons */}
      <div className="flex justify-between items-center h-fit w-full">

        { maxPageNumber == 0 ? (

          <div className="flex justify-start items-center h-fit w-full">
            No data to show
          </div>

        ) : (

          <div>

            {/* // how many paging left section */}
            <div className="flex justify-start items-center h-fit w-[90%]">

              <div>
                Showing {currentPageNumber * maxItemsInPage} to {Math.min((currentPageNumber + 1) * maxItemsInPage, loans.length - currentPageNumber * maxItemsInPage)} of {maxPageNumber}
              </div>
            
            </div> 

            {/* paging buttons */}
            <div className="flex justify-between items-center h-fit w-[10%]">
            
              <div onClick={() => currentPageNumber < 1 ? 1 : setCurrentPageNumber(currentPageNumber + 1)}>
                Previous
              </div>

              {/* number */}
              <div>
                {currentPageNumber}
              </div>

              {/* next */}
              <div onClick={() => currentPageNumber == maxPageNumber ? currentPageNumber : setCurrentPageNumber(currentPageNumber + 1)}>
                Next
              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  </div>);
}
