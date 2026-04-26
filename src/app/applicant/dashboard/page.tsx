"use client"

import Image from "next/image";
import CalendarLogo from "../../../../public/calendar.svg"

import { useUserStore } from "@/hooks/userStore";
import { useEffect, useState } from "react";
import ApplicantDashboard_PaymentScheduleRow from "@/components/ui/applicant-dashboard/payment_schedule_block";
import ApplicantDashboard_ApplicationProgressComponent from "@/components/ui/applicant-dashboard/application_progress_block";
import ApplicantDashboard_ApplicantNavbar from "@/components/ui/applicant-dashboard/applicant_navbar";

type LoanSummary = {
  id: string;
  requestedAmount?: number;
  due_date?: string;
};

export default function ApplicantDashboardPage(){
    
    // init variables
    const [currentLoanValue, setCurrentLoanValue] = useState<number>(45000000)
    const [installmentValue] = useState<number>(0)
    const submitTime = new Date(2026, 7, 15, 12, 20)
    const verifiedTime = new Date(2026, 7, 18, 12, 20)
    const disbursedTime = new Date(2026, 7, 20, 12, 20)
    const [, setNearestDueDateInstallment] = useState<string | null>(null)
    const [, setCurrentLoan] = useState<LoanSummary | null>(null)
    const [, setLoans] = useState<LoanSummary[]>([])
    const username = useUserStore((state) => (state.user?.username)) || "Rayhan Farrukh"
    const userId = useUserStore((state) => (state.user?.id))

    // fetch conditions from the db
    useEffect(() => {

        // fetch all loans connected to current user
        const fetchAllLoans = async () => {
            if (!userId) return

            const params = new URLSearchParams({ user_id: String(userId) });


            try {
                const response = await fetch(`/api/loans?${params}`);

                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const fetchedLoans = result.data?.data?.loans ?? result.data?.loans ?? []
                // take the first one for the loan
                setLoans(fetchedLoans)
                setCurrentLoanValue(result.data?.currentLoanValue ?? fetchedLoans[0]?.requestedAmount ?? 0)
                setCurrentLoan(fetchedLoans[0] ?? null)

                // take the nearest due date installment
                setNearestDueDateInstallment(fetchedLoans[0]?.due_date ?? null)

            } catch (error) {
                console.error("Fetch error at applicant/dashboard/page.tsx:", error);
            }
        }

        fetchAllLoans()

    }, [userId])

    return (

      <div className={`flex flex-col justify-start items-center w-full min-h-screen bg-[#F9FAFB] gap-4`}>
      
          {/* navbar */}
          <div className="flex justify-center items-center w-full h-fit">
              <ApplicantDashboard_ApplicantNavbar />
          </div>
      
          {/* title */}
          <div className="flex justify-start items-center w-[90%] h-fit text-4xl font-bold pt-10">
            Welcome back, 
            <span className="text-[#FCB82E] ">{username}</span>
          </div>
      
          {/* caption */}
          <div className="flex justify-start items-center w-[90%] h-fit text-lg pb-4 text-gray-500">
            Your generosity is changing lives - thank you for making a difference.
          </div>

          {/* current loan status of aspects */}
          <div className="flex flex-col justify-start items-center gap-2 w-[90%] h-fit bg-white shadow-2xl p-4 rounded-2xl">
          
            {/* TITLE */}
            <div className="flex justify-start items-center w-full h-fit text-sm text-[#4A5565]">
              Status Pinjaman Terkini
            </div>

            {/* value of loan status */}
            <div className="flex justify-start items-center w-full h-fit text-5xl font-bold">
              Rp {currentLoanValue.toString()}
            </div>

            {/* Reamining Balance */}
            <div className="flex justify-start items-center w-full h-fit text-sm text-[#4A5565]">
              Sisa Saldo
            </div>
          </div>
      
          {/* next due date */}
          <div className="flex justify-center items-center w-[90%] h-fit bg-[#FEFCE8] p-4 rounded-2xl">

            {/* symbol */}
            <div className="flex justify-center items-center w-[5%]">
              <Image
                  src={CalendarLogo}
                  alt="Calendar Logo"
                  width={40}
                  height={40}
              />
            </div>

            {/* title + caption */}
            <div className="flex flex-col justify-center items-start w-[85%] h-fit gap-1">

              {/* title */}
              <div className="flex w-full justify-start items-center h-fit font-semibold">
                  Jatuh tempo terdekat
              </div>

              {/* caption */}
              <div className="flex w-full justify-start items-center h-fit font-light text-gray-500 text-sm">
                October 20, 2026
              </div>

            </div>

            {/* pay now button */}
            <div className="flex justify-center items-center text-center w-[10%] p-3 rounded-2xl bg-[#009966] text-white font-semibold">
                Bayar Sekarang
            </div>

          </div>

          {/* select loan container */}
          <div className="flex justify-center items-center w-[90%] h-fit p-2">

            {/* title section */}
            <div className="flex justify-start items-center w-full h-fit text-lg font-semibold">
              Pilih Pinjaman
            </div>

            {/* dropdowns */}
            <div className="flex justify-start items-center w-full h-fit font-semibold bg-white shadow-2xl">
              {/* TODO : IMPLEMENT Dropdown to choose selected loan */}
            </div>

          </div>

          {/* payment schedules + application progress container */}
          <div className="flex justify-between items-center h-1/2 w-[90%] gap-4 pb-4">

            {/* payment schedules  */}
            <div className="flex flex-col h-full w-[65%] justify-start items-center shadow-2xl bg-white rounded-2xl shadow-2xl">

              {/* list of payment schedules */}
              <div className="grid grid-cols-1 gap-2 justify-start items-center w-full h-fit p-2 ">
                
                {/* title */}
                <div className="flex justify-start items-center w-full h-fit p-4 font-semibold text-lg">
                  Jadwal Pembayaran
                </div>

                <ApplicantDashboard_PaymentScheduleRow installment_value={Number(installmentValue)} installment_date={new Date(2025, 11, 25, 23, 59)} installment_order={1} installment_status="paid"/>

                <ApplicantDashboard_PaymentScheduleRow installment_value={Number(installmentValue)} installment_date={new Date(2026, 0, 25, 23, 59)} installment_order={2} installment_status="due_soon"/>

                <ApplicantDashboard_PaymentScheduleRow installment_value={Number(installmentValue)} installment_date={new Date(2026, 1, 25, 23, 59)} installment_order={3} installment_status="pending"/>

                <ApplicantDashboard_PaymentScheduleRow installment_value={Number(installmentValue)} installment_date={new Date(2026, 2, 25, 23, 59)} installment_order={4} installment_status="pending"/>

              </div>

            </div>

            {/* application progress */}
            <div className="flex h-full w-[35%] justify-center items-start shadow-2xl bg-white rounded-2xl ">
              <ApplicantDashboard_ApplicationProgressComponent submitTime={submitTime} verifiedTime={verifiedTime} disbursedTime={disbursedTime}/>
            </div>

          </div>
                    
        </div>
    );
}
