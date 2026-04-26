
import { useApplicationProgressStore } from "@/hooks/applicationProgressStore"
import { useState } from "react"

export default function ApplicantForm_FinancialNeedsSection() {

    const loan_title = useApplicationProgressStore((state) => (state.loan_title))
    const requested_amount = useApplicationProgressStore((state) => (state.requested_amount))
    const loan_purpose = useApplicationProgressStore((state) => (state.loan_purpose))

    const setLoanTitle = useApplicationProgressStore((state) => (state.setLoanTitle))
    const setLoanPurpose = useApplicationProgressStore((state) => (state.setLoanPurpose))
    const setRequestedAmount = useApplicationProgressStore((state) => (state.setRequestedAmount))
    const [requestedAmountInput, setRequestedAmountInput] = useState(
        Number.isFinite(requested_amount ?? NaN) && requested_amount !== 0
            ? String(requested_amount)
            : ""
    )

    const incrementStep = useApplicationProgressStore((state) => state.incrementStep)
    const decrementStep = useApplicationProgressStore((state) => state.decrementStep)

    const handleBack = async () => {
        decrementStep()
    }

    const handleContinue = async () => {
        incrementStep()
    }

    const handleRequestedAmountChange = (value: string) => {
        const normalizedValue = value.replace(/[^\d]/g, "")
        setRequestedAmountInput(normalizedValue)
        setRequestedAmount(normalizedValue === "" ? 0 : Number(normalizedValue))
    }
    
    return (
        <div className="flex flex-col justify-center items-start gap-2 h-full w-full bg-white p-4 rounded-2xl">

            {/* title */}
            <div className="flex w-full h-fit font-bold text-2xl">
                Kebutuhan Finansial
            </div>

            {/* caption */}
            <div className="flex w-full h-fit font-light text-sm">
                Jelaskan mengenai pengajuan pinjaman Anda
            </div>

            {/* full name section */}
            <div className="flex flex-col w-full h-fit gap-2">
                
                {/* title */}
                <div className="flex w-full h-fit justify-start items-center font-bold">
                    Judul Pinjaman *
                </div>

                {/* input */}
                <div>
                    <input
                        value={String(loan_title)}
                        onChange={(e) => setLoanTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Masukkan nama pinjaman anda..."
                    />
                </div>
            </div>

            {/* requested amount section */}
            <div className="flex flex-col w-full h-fit gap-2">
                
                {/* title */}
                <div className="flex w-full h-fit justify-start items-center font-bold">
                    Jumlah yang diajukan (Rp)
                </div>

                {/* input */}
                <div>
                    <input
                        value={requestedAmountInput}
                        onChange={(e) => handleRequestedAmountChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter"}
                        inputMode="numeric"
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Masukkan jumlah pinjaman anda..."
                    />
                </div>
            </div>

            {/* loan purpose section */}
            <div className="flex flex-col w-full h-[40%] gap-2">
                
                {/* title */}
                <div className="flex w-full h-fit justify-start items-center font-bold">
                    Tujuan Pinjaman *
                </div>

                {/* input */}
                <div className="flex w-full h-[40%] justify-center items-center">
                    <textarea
                        value={String(loan_purpose)}
                        onChange={(e) => setLoanPurpose(e.target.value)}
                        className="w-full min-h-40 border border-black/20 bg-white p-4 rounded-2xl shadow-2xl resize-none"
                        placeholder="Jelaskan tujuan pengajuan pinjaman anda..."
                    />
                </div>
            </div>

            {/* cta button */}
            <div className="flex w-full h-fit justify-end items-center gap-4 p-2">

                {/* back button */}
                <div className="px-6 py-2 flex justify-center items-center text-gray-500 border border-gray-400 rounded-2xl" onClick={handleBack}>
                    Kembali 
                </div>

                {/* continue button */}
                <div className="px-6 py-2 flex justify-center items-center text-white border border-gray-009966 rounded-2xl bg-[#009966]/60" onClick={handleContinue}>
                    Lanjut
                </div>
            </div>

        </div>
    );
}
