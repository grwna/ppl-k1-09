
import { useApplicationProgressStore } from "@/hooks/applicationProgressStore";

export default function ApplicantForm_PersonalInformationSection() {

    const applicationProgress = useApplicationProgressStore((state) => (state.application_progress))
    const full_name = useApplicationProgressStore((state) => (state.full_name))
    const university_name = useApplicationProgressStore((state) => (state.university_name))
    const student_id_number = useApplicationProgressStore((state) => (state.student_id_number))

    const setFullName = useApplicationProgressStore((state) => (state.setFullName))
    const setUniversityName = useApplicationProgressStore((state) => (state.setUniversityName))
    const setStudentIdNumber = useApplicationProgressStore((state) => (state.setStudentIdNumber))

    const incrementStep = useApplicationProgressStore((state) => state.incrementStep)
    const decrementStep = useApplicationProgressStore((state) => state.decrementStep)

    const handleBack = async () => {
        decrementStep()
    }

    const handleContinue = async () => {
        incrementStep()
    }
    
    return (
        <div className="flex flex-col justify-center items-start gap-2 h-fit w-full bg-white p-4 rounded-2xl">

            {/* title */}
            <div className="flex w-full h-fit font-bold text-2xl">
                Personal Information
            </div>

            {/* caption */}
            <div className="flex w-full h-fit font-light text-sm">
                Please provide your basic information as a student
            </div>

            {/* full name section */}
            <div className="flex flex-col w-full h-fit gap-2">
                
                {/* title */}
                <div className="flex w-full h-fit justify-start items-center font-bold">
                    Nama Lengkap*
                </div>

                {/* input */}
                <div>
                    <input
                        value={String(full_name)}
                        onChange={(e) => setFullName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Masukkan nama anda..."
                    />
                </div>
            </div>

            {/* university section */}
            <div className="flex flex-col w-full h-fit gap-2">
                
                {/* title */}
                <div className="flex w-full h-fit justify-start items-center font-bold">
                    Universitas*
                </div>

                {/* input */}
                <div>
                    <input
                        value={String(university_name)}
                        onChange={(e) => setUniversityName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Masukkan universitas anda..."
                    />
                </div>
            </div>

            {/* student id number section */}
            <div className="flex flex-col w-full h-fit gap-2">
                
                {/* title */}
                <div className="flex w-full h-fit justify-start items-center font-bold">
                    Nomor Induk Mahasiswa*
                </div>

                {/* input */}
                <div>
                    <input
                        value={String(student_id_number)}
                        onChange={(e) => setStudentIdNumber(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Masukkan nomor induk mahasiswa anda..."
                    />
                </div>
            </div>

            {/* cta button */}
            <div className="flex w-full h-fit justify-end items-center gap-4 p-2">

                {/* back button */}
                <div className="px-6 py-2 flex justify-center items-center text-gray-500 border border-gray-400 rounded-2xl" onClick={handleBack}>
                    Back
                </div>

                {/* continue button */}
                <div className="px-6 py-2 flex justify-center items-center text-white border border-gray-009966 rounded-2xl bg-[#009966]/60" onClick={handleContinue}>
                    Continue
                </div>
            </div>

        </div>
    );
}