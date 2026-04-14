

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
        ) return

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

        await fetch("/api/loans", {
            method: "POST",
            body: formData,
        })
        
        const familyCardFormData = new FormData()
        familyCardFormData.append("file", family_card)
        familyCardFormData.append("documentType", "png")
        familyCardFormData.append("applicationId", "xxxx")

        await fetch("/api/documents/upload", {
            method: "POST",
            body: familyCardFormData,
        })
        
        const studentIdCardFormData = new FormData()
        studentIdCardFormData.append("file", student_id_card)
        studentIdCardFormData.append("documentType", "png")
        studentIdCardFormData.append("applicationId", "xxxx")

        await fetch("/api/documents/upload", {
            method: "POST",
            body: studentIdCardFormData,
        })
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
            <div className="flex justify-end gap-4 pt-2">

                <button
                    onClick={decrementStep}
                    className="px-6 py-2 text-gray-500 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                    Kembali
                </button>

                <button
                    onClick={handleSubmitApplication}
                    className="px-6 py-2 text-white bg-[#009966] rounded-xl hover:bg-[#007a4d]"
                >
                    Ajukan
                </button>

            </div>

        </div>
    )
}