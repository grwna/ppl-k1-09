

import { useApplicationProgressStore } from "@/hooks/applicationProgressStore"
import { useRouter } from "next/navigation"
import { useState } from "react"

type CreatedLoanApplicationResponse = {
    data: {
        id: string
    }
}

export default function ApplicantForm_TermsAndAgreementSection() {

    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

    const handleSubmitApplication = async () => {
        if (isSubmitting) return

        const state = useApplicationProgressStore.getState()

        const {
            full_name,
            university_name,
            student_id_number,
            loan_title,
            requested_amount,
            loan_purpose,
            family_card,
            student_id_card,
            comply_to_terms_and_agreement
        } = state

        if (
            !full_name ||
            !university_name ||
            !student_id_number ||
            !loan_title ||
            !requested_amount ||
            !loan_purpose ||
            !family_card ||
            !student_id_card ||
            !comply_to_terms_and_agreement
        ) {
            setSubmitError("Lengkapi semua data dan setujui syarat sebelum mengajukan.")
            return
        }

        setIsSubmitting(true)
        setSubmitError(null)
        setSubmitSuccess(null)

        try {
            const createApplicationResponse = await fetch("/api/loans", {
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
                throw new Error(errorBody?.error || "Gagal membuat pengajuan pinjaman.")
            }

            const createdApplication = (await createApplicationResponse.json()) as CreatedLoanApplicationResponse
            const applicationId = createdApplication.data.id

            const uploadAttachment = async (file: File, documentType: string) => {
                const formData = new FormData()
                formData.append("file", file)
                formData.append("documentType", documentType)

                const response = await fetch(`/api/applications/${applicationId}/attachments`, {
                    method: "POST",
                    body: formData,
                })

                if (!response.ok) {
                    const errorBody = await response.json().catch(() => null)
                    throw new Error(errorBody?.error || "Gagal mengunggah dokumen.")
                }
            }

            await uploadAttachment(family_card, "family_card")
            await uploadAttachment(student_id_card, "student_id_card")

            setSubmitSuccess("Pengajuan berhasil dikirim.")
            router.push("/applicant/dashboard")
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Terjadi kesalahan saat mengajukan pinjaman.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const decrementStep = useApplicationProgressStore((state) => state.decrementStep)
    const switchComplyToTermsAndAgreement = useApplicationProgressStore((state) => state.switchComplyToTermsAndAgreement)

    return (
        <div className="flex flex-col gap-4 w-full h-full bg-white p-6 rounded-2xl">

            {/* Title */}
            <div className="text-2xl font-bold">
                Syarat & Ketentuan
            </div>

            {/* Subtitle */}
            <div className="text-sm text-gray-500">
                Mohon baca dan setujui ketentuan berikut sebelum melanjutkan
            </div>

            {/* Document */}
            <div className="w-full max-h-[300px] overflow-y-auto border rounded-xl p-4 bg-gray-50 text-sm leading-relaxed space-y-4">

                <h2 className="font-semibold text-base">
                    Perjanjian Pinjaman Tanpa Bunga
                </h2>

                <p>
                    Dengan mengajukan permohonan ini, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan dalam program pinjaman mahasiswa tanpa bunga yang diselenggarakan oleh Rumah Amal Salman.
                </p>

                <p>
                    Pinjaman ini merupakan pinjaman tanpa bunga (Qardhul Hasan) yang diberikan untuk mendukung kebutuhan pendidikan melalui prinsip filantropi Islam.
                </p>

                <ul className="list-disc pl-5 space-y-1">
                    <li>Anda bersedia mengembalikan dana pinjaman dalam bentuk cicilan bulanan sesuai kesepakatan setelah pinjaman disetujui.</li>
                    <li>Tidak dikenakan bunga maupun biaya tambahan dalam bentuk apa pun. Total pengembalian sama dengan jumlah pinjaman.</li>
                    <li>Seluruh informasi yang Anda berikan dalam pengajuan ini adalah benar dan dapat dipertanggungjawabkan.</li>
                    <li>Anda memberikan izin kepada Rumah Amal Salman untuk melakukan verifikasi atas data dan dokumen yang telah Anda kirimkan.</li>
                    <li>Dana pinjaman akan digunakan sepenuhnya untuk keperluan pendidikan sesuai dengan tujuan yang Anda ajukan.</li>
                </ul>

                <p>
                    Apabila Anda mengalami kesulitan finansial di kemudian hari, Anda bersedia untuk segera berkomunikasi dengan pihak Rumah Amal Salman guna membahas kemungkinan penyesuaian skema pembayaran.
                </p>

                <ul className="list-disc pl-5 space-y-1">
                    <li>Anda memahami bahwa pinjaman ini merupakan bentuk amanah yang harus dijaga dan dikembalikan secara bertanggung jawab, baik secara moral maupun etika.</li>
                </ul>

            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3">

                <input
                    type="checkbox"
                    onChange={switchComplyToTermsAndAgreement}
                    className="mt-1 w-4 h-4 accent-[#009966]"
                />

                <p className="text-sm text-gray-700">
                    Saya telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku. Saya menyatakan bahwa seluruh data yang saya berikan adalah benar dan saya bersedia memenuhi kewajiban pengembalian pinjaman sesuai ketentuan.
                </p>

            </div>

            {/* Buttons */}
            {(submitError || submitSuccess) && (
                <div className={`rounded-xl px-4 py-3 text-sm ${submitError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {submitError || submitSuccess}
                </div>
            )}

            <div className="flex justify-end gap-4 pt-2">

                <button
                    onClick={decrementStep}
                    className="px-6 py-2 text-gray-500 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                    Kembali
                </button>

                <button
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting}
                    className="px-6 py-2 text-white bg-[#009966] rounded-xl hover:bg-[#007a4d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Mengajukan..." : "Ajukan"}
                </button>

            </div>

        </div>
    )
}
