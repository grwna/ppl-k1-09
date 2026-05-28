
import { useApplicationProgressStore } from "@/hooks/applicationProgressStore"

export default function ApplicantForm_FinancialNeedsSection() {

    const applicationProgress = useApplicationProgressStore((state) => (state.application_progress))
    const loan_title = useApplicationProgressStore((state) => (state.loan_title))
    const requested_amount = useApplicationProgressStore((state) => (state.requested_amount))
    const loan_purpose = useApplicationProgressStore((state) => (state.loan_purpose))

    const setLoanTitle = useApplicationProgressStore((state) => (state.setLoanTitle))
    const setLoanPurpose = useApplicationProgressStore((state) => (state.setLoanPurpose))
    const setRequestedAmount = useApplicationProgressStore((state) => (state.setRequestedAmount))

    const incrementStep = useApplicationProgressStore((state) => state.incrementStep)
    const decrementStep = useApplicationProgressStore((state) => state.decrementStep)

    const handleBack = async () => {
        decrementStep()
    }

    const handleContinue = async () => {
        if (!isStepComplete) return
        incrementStep()
    }

    const handleRequestedAmountChange = (value: string) => {
        const normalizedValue = value.replace(/[^\d]/g, "")
        setRequestedAmountInput(normalizedValue)
        setRequestedAmount(normalizedValue === "" ? 0 : Number(normalizedValue))
    }

    const isStepComplete = Boolean(
        loan_title?.trim() &&
        Number(requested_amount) > 0 &&
        loan_purpose?.trim()
    )
    const inputClassName = "h-8 w-full rounded-md border border-[#D8DEE8] bg-[#F3F4F6] px-3 text-[13px] text-[#111827] shadow-inner outline-none transition placeholder:text-[#7B8190] focus:border-[#FCB82E] focus:bg-white focus:ring-2 focus:ring-[#FCB82E]/20"
    const labelClassName = "text-xs font-semibold text-[#111827]"
    
    return (
        <div className="rounded-lg border border-[#E2E8F0] bg-white px-7 py-8 shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:px-8">
            <div>
                <h2 className="text-[22px] font-extrabold leading-tight text-[#111827]">
                    Financial Needs
                </h2>
                <p className="mt-2 text-xs font-medium text-[#667085]">
                    Tell us about your loan requirements
                </p>
            </div>

            <div className="mt-6 space-y-4">
                <label className="block">
                    <span className={labelClassName}>Loan Title *</span>
                    <input
                        value={String(loan_title)}
                        onChange={(e) => setLoanTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={`${inputClassName} mt-2`}
                        placeholder="Enter your Loan Title"
                    />
                </label>

                <label className="block">
                    <span className={labelClassName}>Requested Amount (Rp) *</span>
                    <input
                        value={String(requested_amount)}
                        onChange={(e) => setRequestedAmount(Number(e.target.value))}
                        onKeyDown={(e) => e.key === "Enter"}
                        inputMode="numeric"
                        className={`${inputClassName} mt-2`}
                        placeholder="e.g., 5000000"
                    />
                </label>

                <label className="block">
                    <span className={labelClassName}>Loan Purpose *</span>
                    <textarea
                        value={String(loan_purpose)}
                        onChange={(e) => setLoanPurpose(e.target.value)}
                        className="mt-2 min-h-32 w-full resize-none rounded-md border border-[#D8DEE8] bg-[#F3F4F6] px-3 py-3 text-[13px] text-[#111827] shadow-inner outline-none transition placeholder:text-[#7B8190] focus:border-[#FCB82E] focus:bg-white focus:ring-2 focus:ring-[#FCB82E]/20"
                        placeholder="Please explain why you need this loan and how you plan to use it"
                    />
                    <span className="mt-2 block text-[11px] font-medium text-[#667085]">
                        Provide a detailed explanation of your educational expenses and financial needs
                    </span>
                </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-5 border-t border-[#E5E7EB] pt-4">
                <button
                    type="button"
                    onClick={handleBack}
                    className="h-8 rounded-md border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#111827] transition hover:bg-[#F8FAFC]"
                >
                    Back
                </button>

                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!isStepComplete}
                    className="h-8 rounded-md px-4 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:bg-[#B7D9CF] disabled:text-white/80 enabled:bg-[#009966] enabled:hover:bg-[#007A52]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}