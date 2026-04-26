"use client"

import Image from "next/image";
import CalendarLogo from "../../../../public/calendar.svg"
import { useUserStore } from "@/hooks/userStore";
import { useEffect, useState, useMemo } from "react";
import ApplicantDashboard_PaymentScheduleRow from "@/components/ui/applicant-dashboard/payment_schedule_block";
import ApplicantDashboard_ApplicationProgressComponent from "@/components/ui/applicant-dashboard/application_progress_block";
import ApplicantDashboard_ApplicantNavbar from "@/components/ui/applicant-dashboard/applicant_navbar";

export default function ApplicantDashboardPage() {
    const installmentFreq = 4;
    const [applications, setApplications] = useState<any[]>([]);
    const [selectedLoanId, setSelectedLoanId] = useState<string>("");
    const [totalValue, setTotalValue] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const username = useUserStore((state) => (state.user?.username)) || "Rayhan Farrukh";
    // const userId = useUserStore((state) => state.user?.id);
    const userId = "7bda909d-71f8-4b40-994e-15d4b710479b"

    useEffect(() => {
        const fetchAllLoans = async () => {
            if (!userId) return;
            setIsLoading(true);
            try {
                // Fixed the URL protocol and string interpolation
                const response = await fetch(`/api/loans/${userId}`);
                if (!response.ok) throw new Error("Failed to fetch");

                const result = await response.json();
                const apps = result.data.applications || [];

                setApplications(apps);
                setTotalValue(result.data.totalLoanedValue || 0);

                // Set initial selection to the first loan
                if (apps.length > 0) {
                    setSelectedLoanId(apps[0].id);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAllLoans();
    }, [userId]);

    // 1. Logic for choosing the nearest due date across ALL loans
    const nearestDueDate = useMemo(() => {
        const activeDates = applications
            .map(app => app.dueDate ? new Date(app.dueDate).getTime() : null)
            .filter((date): date is number => date !== null && date > Date.now());

        return activeDates.length > 0 ? new Date(Math.min(...activeDates)) : null;
    }, [applications]);

    // 2. Logic for the currently selected loan's installments
    const selectedLoan = useMemo(() => {
        return applications.find(app => app.id === selectedLoanId);
    }, [selectedLoanId, applications]);

    const installmentValue = useMemo(() => {
        if (!selectedLoan) return 0;
        const amount = selectedLoan.loanDetails?.approvedAmount || selectedLoan.requestedAmount;
        return Number(amount) / installmentFreq;
    }, [selectedLoan]);

    // Helper to generate mock installments based on frequency
    const generateInstallments = (loan: any) => {
        if (!loan || !loan.dueDate) return [];
        const baseDate = new Date(loan.dueDate);

        return Array.from({ length: installmentFreq }).map((_, i) => {
            // Subtract months based on index to show progress backwards from due date
            const date = new Date(baseDate);
            date.setMonth(date.getMonth() - (installmentFreq - 1 - i));

            return {
                order: i + 1,
                date: date,
                // Simple logic for status
                status: i === 0 ? "paid" : i === 1 ? "due_soon" : "pending"
            };
        });
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="flex flex-col justify-start items-center w-full min-h-screen bg-[#F9FAFB] gap-4">
            <ApplicantDashboard_ApplicantNavbar />

            <div className="w-[90%] pt-10">
                <h1 className="text-4xl font-bold">
                    Selamat Datang Kembali, <span className="text-[#FCB82E]">{username}</span>
                </h1>
                <p className="text-lg text-gray-500 mt-2">
                    Kedermawanan Anda membantu hidup orang lain - terimakasih atas kontribusi Anda.
                </p>
            </div>

            {/* Loan Status Card */}
            <div className="flex flex-col gap-2 w-[90%] bg-white shadow-xl p-6 rounded-2xl">
                <span className="text-sm text-[#4A5565]">Status Pinjaman Terkini</span>
                <span className="text-5xl font-bold">Rp {totalValue.toLocaleString('id-ID')}</span>
                <span className="text-sm text-[#4A5565]">Sisa Saldo Pinjaman</span>
            </div>

            {/* Nearest Due Date Banner */}
            <div className="flex justify-between items-center w-[90%] bg-[#FEFCE8] p-4 rounded-2xl border border-yellow-100">
                <div className="flex items-center gap-4">
                    <Image src={CalendarLogo} alt="Calendar" width={40} height={40} />
                    <div>
                        <p className="font-semibold">Jatuh tempo terdekat</p>
                        <p className="text-gray-500 text-sm">
                            {nearestDueDate
                                ? nearestDueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                : "No upcoming due dates"}
                        </p>
                    </div>
                </div>
                <button className="px-6 py-3 rounded-xl bg-[#009966] text-white font-bold hover:bg-[#007a52] transition-all">
                    Bayar Sekarang
                </button>
            </div>

            {/* Selection Dropdown */}
            <div className="w-[90%] flex flex-col gap-2">
                <label className="text-lg font-semibold">Pilih Pinjaman</label>
                <select
                    value={selectedLoanId}
                    onChange={(e) => setSelectedLoanId(e.target.value)}
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-[#FCB82E]"
                >
                    {applications.map((app) => (
                        <option key={app.id} value={app.id}>
                            {app.description} - Rp {Number(app.requestedAmount).toLocaleString('id-ID')} ({app.status})
                        </option>
                    ))}
                </select>
            </div>

            {/* Details Section */}
            <div className="flex justify-between w-[90%] gap-6 pb-10">
                {/* Installments */}
                <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="font-bold text-lg mb-4">Jadwal Pembayaran</h3>
                    <div className="flex flex-col gap-3">
                        {selectedLoan ? generateInstallments(selectedLoan).map((inst) => (
                            <ApplicantDashboard_PaymentScheduleRow
                                key={inst.order}
                                installment_value={installmentValue}
                                installment_date={inst.date}
                                installment_order={inst.order}
                                installment_status={inst.status}
                            />
                        )) : (
                            <p className="text-gray-400 text-center py-10">No payment schedule available</p>
                        )}
                    </div>
                </div>

                {/* Progress */}
                <div className="w-[35%] bg-white rounded-2xl shadow-xl h-full flex ">
                    <ApplicantDashboard_ApplicationProgressComponent
                        submitTime={selectedLoan ? new Date(selectedLoan.createdAt) : new Date()}
                        verifiedTime={selectedLoan?.status === "APPROVED" ? new Date(selectedLoan.createdAt) : new Date()}
                        disbursedTime={selectedLoan?.loanDetails?.status === "ACTIVE" ? new Date(selectedLoan.loanDetails.dueDate) : new Date()}
                    />
                </div>
            </div>
        </div>
    );
}