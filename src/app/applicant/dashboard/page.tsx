"use client"

import Image from "next/image";
import CalendarLogo from "../../../../public/calendar.svg"

import { useUserStore } from "@/hooks/userStore";
import { useEffect, useState } from "react";
import ApplicantDashboard_PaymentScheduleRow from "@/components/ui/applicant-dashboard/payment_schedule_block";
import ApplicantDashboard_ApplicationProgressComponent from "@/components/ui/applicant-dashboard/application_progress_block";

export default function ApplicantDashboardPage(){
    
    // init variables
    const installmentFreq = 4 // number of installments
    const [currentLoanValue, setCurrentLoanValue] = useState<Number>(45000000)
    const [installmentValue, setInstallmentValue] = useState<Number>(0)
    const username = useUserStore((state) => (state.user?.username))
    const userId = useUserStore((state) => (state.user?.id))

    // fetch current loan value (STILL WRONG BECAUSE HAVEN'T SEEN THE BE IMPLEMENTATION)
    useEffect(() => {
        
        const fetchCurrentLoanValue = async () => {

            try {
                const response = await fetch(`https://localhost:3000/loan/${userId}`)
                
                // Cast the JSON result to the 'User' type
                const data : any = response.json();
                setCurrentLoanValue(data.loan_value)
                return data;
            } catch (e) {
                console.log("Error at applicant/dashboard/page.tsx");
            }
        }

        fetchCurrentLoanValue()
        setInstallmentValue(Number(currentLoanValue) / installmentFreq)

    }, [currentLoanValue])

    return (
      // main container
      <div>
        {/* title */}
        <div>
          Welcome back, {username}
        </div>

        {/* caption */}
        <div>
          Your generosity is changing lives - thank you for making a difference
        </div>

        {/* current loan status of aspects */}
        <div className="flex justify-between items-center">
          
          {/* TITLE */}
          <div>
            Current Loan Status
          </div>

          {/* value of loan status */}
          <div>
            Rp {currentLoanValue.toString()}
          </div>

        </div>

        {/* next due date */}
        <div className="flex justify-center items-center">

            {/* symbol */}
            <div>
                <Image
                    src={CalendarLogo}
                    alt="Calendar Logo"
                />
            </div>

            {/* title + caption */}
            <div>

                {/* title */}
                <div>
                    Next Due Date
                </div>

                {/* caption */}
                <div>
                    October 20, 2026
                </div>
            </div>

            {/* pay now button */}
            <div>
                Pay Now
            </div>

        </div>

        {/* payment schedules + application progress container */}
        <div className="flex justify-between items-center">

          {/* payment schedules  */}
          <div className="flex h-full w-[50%] justify-center items-center">
            <ApplicantDashboard_PaymentScheduleRow installment_value={Number(installmentValue)} installment_date={new Date(2025, 11, 25, 23, 59)} installment_order={1} installment_status="Paid"/>
            <ApplicantDashboard_PaymentScheduleRow installment_value={Number(installmentValue)} installment_date={new Date(2026, 0, 25, 23, 59)} installment_order={2} installment_status="Paid"/>
            <ApplicantDashboard_PaymentScheduleRow installment_value={Number(installmentValue)} installment_date={new Date(2026, 1, 25, 23, 59)} installment_order={3} installment_status="Paid"/>
            <ApplicantDashboard_PaymentScheduleRow installment_value={Number(installmentValue)} installment_date={new Date(2026, 2, 25, 23, 59)} installment_order={4} installment_status="Paid"/>
          </div>

          {/* application progress */}
          <div className="flex h-full w-[50%] justify-center items-center">
            <ApplicantDashboard_ApplicationProgressComponent />
          </div>

        </div>
        
      </div>  
    );
}