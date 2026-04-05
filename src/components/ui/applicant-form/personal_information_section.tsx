
import { useApplicationProgressStore } from "@/hooks/applicationProgressStore";

export default function ApplicantForm_PersonalInformationSection() {

    const applicationProgress = useApplicationProgressStore((state) => (state.application_progress))
    const full_name = useApplicationProgressStore((state) => (state.full_name))
    const university_name = useApplicationProgressStore((state) => (state.university_name))
    const student_id_number = useApplicationProgressStore((state) => (state.student_id_number))

    return (
        <div>

            {/* title */}
            <div className="flex w-full h-fit">
                Personal Information
            </div>

            {/* caption */}
            <div className="flex w-full h-fit">
                Please provide your basic information as a student
            </div>

            {/* full name section */}
            <div className="flex w-full h-fit">
                
                {/* title */}
                <div>
                    Full name
                </div>

                {/* input */}
                <div>
                    <input
                        value={String(full_name)}
                        onChange={(e) => useApplicationProgressStore((state) => {state.setFullName(e.target.value)})}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Masukkan nama anda..."
                    />
                </div>
            </div>

            {/* university section */}
            <div className="flex w-full h-fit">
                
                {/* title */}
                <div>
                    University
                </div>

                {/* input */}
                <div>
                    <input
                        value={String(university_name)}
                        onChange={(e) => useApplicationProgressStore((state) => {state.setUniversityName(e.target.value)})}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Masukkan universitas anda..."
                    />
                </div>
            </div>

            {/* student id number section */}
            <div className="flex w-full h-fit">
                
                {/* title */}
                <div>
                    Full name
                </div>

                {/* input */}
                <div>
                    <input
                        value={String(student_id_number)}
                        onChange={(e) => useApplicationProgressStore((state) => {state.setStudentIdNumber(e.target.value)})}
                        onKeyDown={(e) => e.key === "Enter"}
                        className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                        placeholder="Masukkan nomor induk mahasiswa anda..."
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