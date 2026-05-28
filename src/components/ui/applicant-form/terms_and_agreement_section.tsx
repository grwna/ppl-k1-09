

import { useApplicationProgressStore } from "@/hooks/applicationProgressStore"

export default function ApplicantForm_TermsAndAgreementSection() {

    const handleSubmitApplication = async () => {
        const state = useApplicationProgressStore.getState()

        const {
            full_name,
            university_name,
            student_id_number,
            loan_title,
            requested_amount,
            loan_purpose,
            comply_to_terms_and_agreement
        } = state

        if (
            !full_name ||
            !university_name ||
            !student_id_number ||
            !loan_title ||
            !requested_amount ||
            !loan_purpose ||
            !comply_to_terms_and_agreement
        ) {
            setSubmitError("Please complete all data and accept the agreement before submitting.")
            return
        }

        const formData = new FormData()
        formData.append("full_name", full_name)
        formData.append("university_name", university_name)
        formData.append("student_id_number", student_id_number)
        formData.append("loan_title", loan_title)
        formData.append("requested_amount", String(requested_amount))
        formData.append("loan_purpose", loan_purpose)
        formData.append("student_id_card_file", student_id_card)
        formData.append("family_card_file", family_card)
        formData.append("terms_and_agreement_compliance", String(comply_to_terms_and_agreement))

        try {
            const createApplicationResponse = await fetch("/api/loan-applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requestedAmount: requested_amount,
                    description: `${loan_title}\n\n${loan_purpose}`,
                    collateralUrl: "",
                    collateralDescription: [
                        `Nama: ${full_name}`,
                        `Universitas: ${university_name}`,
                        `NIM: ${student_id_number}`,
                    ].join("\n"),
                }),
            })

            if (!createApplicationResponse.ok) {
                const errorBody = await createApplicationResponse.json().catch(() => null)
                throw new Error(errorBody?.error || "Failed to create loan application.")
            }

            await createApplicationResponse.json() as CreatedLoanApplicationResponse

            setSubmitSuccess("Application submitted successfully.")
            router.push("/applicant/dashboard")
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Something went wrong while submitting the application.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const decrementStep = useApplicationProgressStore((state) => state.decrementStep)
    const fullName = useApplicationProgressStore((state) => state.full_name)
    const universityName = useApplicationProgressStore((state) => state.university_name)
    const studentIdNumber = useApplicationProgressStore((state) => state.student_id_number)
    const loanTitle = useApplicationProgressStore((state) => state.loan_title)
    const requestedAmount = useApplicationProgressStore((state) => state.requested_amount)
    const loanPurpose = useApplicationProgressStore((state) => state.loan_purpose)
    const complyToTermsAndAgreement = useApplicationProgressStore((state) => state.comply_to_terms_and_agreement)
    const switchComplyToTermsAndAgreement = useApplicationProgressStore((state) => state.switchComplyToTermsAndAgreement)
    const isApplicationComplete = Boolean(
        fullName?.trim() &&
        universityName?.trim() &&
        studentIdNumber?.trim() &&
        loanTitle?.trim() &&
        Number(requestedAmount) > 0 &&
        loanPurpose?.trim() &&
        complyToTermsAndAgreement
    )

    return (
        <div className="rounded-lg border border-[#E2E8F0] bg-white px-7 py-8 shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:px-8">
            <div>
                <h2 className="text-[22px] font-extrabold leading-tight text-[#111827]">
                    Terms & Agreement
                </h2>
                <p className="mt-2 text-xs font-medium text-[#667085]">
                    Please review and accept the loan agreement terms
                </p>
            </div>

            <div className="mt-6 max-h-86 overflow-y-auto rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-5 text-xs leading-6 text-[#334155]">
                <h3 className="text-sm font-bold text-[#111827]">
                    Interest-Free Loan Agreement
                </h3>

                <p className="mt-4">
                    By submitting this application, you acknowledge and agree to the following terms and conditions of the Rumah Amal Salman interest-free student loan program:
                </p>

                <p className="mt-4">
                    This is an interest-free loan (Qardhul Hasan) provided to support your education through Islamic philanthropy principles.
                </p>

                <ul className="mt-3 space-y-2 pl-4">
                    <li>You agree to repay the loan amount in monthly installments as agreed upon after loan approval.</li>
                    <li>No interest or additional fees will be charged on this loan. The repayment amount equals the borrowed amount.</li>
                    <li>All information provided in this application is accurate and truthful to the best of your knowledge.</li>
                    <li>You authorize Rumah Amal Salman to verify the information and documents provided.</li>
                    <li>You commit to using the loan funds solely for educational purposes as stated in your application.</li>
                </ul>

                <p className="mt-4">
                    In case of financial hardship, you agree to communicate promptly with Rumah Amal Salman to discuss alternative repayment arrangements.
                </p>

                <p className="mt-3">
                    You understand that this loan is a trust (amanah) and you are morally and ethically obligated to repay it responsibly.
                </p>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-[#E2E8F0] bg-white px-3 py-4">
                <input
                    type="checkbox"
                    checked={complyToTermsAndAgreement}
                    onChange={switchComplyToTermsAndAgreement}
                    className="mt-0.5 h-4 w-4 rounded border-[#111827] accent-[#111827]"
                />
                <span className="text-xs font-semibold leading-6 text-[#111827]">
                    I have read and agree to the interest-free loan agreement terms and conditions. I confirm that all information provided is accurate and I commit to fulfilling my repayment obligations.
                </span>
            </label>

            {(submitError || submitSuccess) && (
                <div className={`mt-5 rounded-lg px-4 py-3 text-sm ${submitError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {submitError || submitSuccess}
                </div>
            )}

            <div className="mt-7 flex justify-end gap-5 border-t border-[#E5E7EB] pt-3">
                <button
                    type="button"
                    onClick={decrementStep}
                    className="h-8 rounded-md border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#111827] transition hover:bg-[#F8FAFC]"
                >
                    Back
                </button>

                <button
                    type="button"
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting || !isApplicationComplete}
                    className="h-8 rounded-md px-6 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:bg-[#B7D9CF] disabled:text-white/80 enabled:bg-[#009966] enabled:hover:bg-[#007A52]"
                >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
            </div>
        </div>
    )
}