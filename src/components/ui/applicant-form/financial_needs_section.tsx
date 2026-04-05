
import { useApplicationProgressStore } from "@/hooks/applicationProgressStore"

export default function ApplicantForm_FinancialNeedsSection() {

    const applicationProgress = useApplicationProgressStore((state) => (state.application_progress))
    const loan_title = useApplicationProgressStore((state) => (state.loan_title))
    const requested_amount = useApplicationProgressStore((state) => (state.requested_amount))
    const loan_purpose = useApplicationProgressStore((state) => (state.loan_purpose))

    return (
        <div>

            {/* title */}
            <div className="flex w-full h-fit">
                Financial Needs
            </div>

            {/* caption */}
            <div className="flex w-full h-fit">
                Tell us about your loan requirements
            </div>

            {/* full name section */}
            <div className="flex w-full h-fit">
                
                {/* title */}
                <div>
                    Loan Title
                </div>

                {/* input */}
                <div>
                    <input
                        value={String(loan_title)}
                        onChange={(e) => useApplicationProgressStore((state) => {state.setLoanTitle(e.target.value)})}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Masukkan nama pinjaman anda..."
                    />
                </div>
            </div>

            {/* requested amount section */}
            <div className="flex w-full h-fit">
                
                {/* title */}
                <div>
                    Jumlah yang diajukan (Rp)
                </div>

                {/* input */}
                <div>
                    <input
                        value={String(requested_amount)}
                        onChange={(e) => useApplicationProgressStore((state) => {state.setRequestedAmount(Number(e.target.value))})}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Masukkan universitas anda..."
                    />
                </div>
            </div>

            {/* loan purpose section */}
            <div className="flex w-full h-fit">
                
                {/* title */}
                <div>
                    Loan Purpose
                </div>

                {/* input */}
                <div>
                    <input
                        value={String(loan_purpose)}
                        onChange={(e) => useApplicationProgressStore((state) => {state.setLoanPurpose(e.target.value)})}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Jelaskan tujuan pengajuan pinjaman anda..."
                    />
                </div>
            </div>

            {/* cta button */}
            <div className="flex w-full h-fit">

                {/* back button */}
                <div>
                    Back
                </div>

                {/* continue button */}
                <div>
                    Continue
                </div>
            </div>

        </div>
    );
}