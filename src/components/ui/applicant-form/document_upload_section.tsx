import { FileText } from "lucide-react";

import { useApplicationProgressStore } from "@/hooks/applicationProgressStore";

import ApplicantForm_FamilyCardUploadBlock from "./family_card_upload_block";
import ApplicantForm_StudentIdCardUploadBlock from "./student_id_card_upload_block";

export default function ApplicantForm_DocumentUploadSection() {
    const studentIdCard = useApplicationProgressStore((state) => state.student_id_card);
    const familyCard = useApplicationProgressStore((state) => state.family_card);
    const incrementStep = useApplicationProgressStore((state) => state.incrementStep);
    const decrementStep = useApplicationProgressStore((state) => state.decrementStep);
    const isStepComplete = Boolean(studentIdCard && familyCard);

    const handleBack = async () => {
        decrementStep();
    };

    const handleContinue = async () => {
        if (!isStepComplete) return;
        incrementStep();
    };

    return (
        <div className="rounded-lg border border-[#E2E8F0] bg-white px-7 py-8 shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:px-8">
            <div>
                <h2 className="text-[22px] font-extrabold leading-tight text-[#111827]">
                    Document Upload
                </h2>
                <p className="mt-2 text-xs font-medium text-[#667085]">
                    Please upload the required documents to verify your identity
                </p>
            </div>

            <div className="mt-6 space-y-6">
                <div>
                    <div className="text-xs font-semibold text-[#111827]">
                        Student ID Card (KTM) *
                    </div>
                    <div className="mt-2">
                        <ApplicantForm_StudentIdCardUploadBlock />
                    </div>
                </div>

                <div>
                    <div className="text-xs font-semibold text-[#111827]">
                        Family Card (KK) *
                    </div>
                    <div className="mt-2">
                        <ApplicantForm_FamilyCardUploadBlock />
                    </div>
                </div>

                <div className="rounded-lg border border-[#FCD34D] bg-[#FFFBEB] px-4 py-4 text-[#A65F00]">
                    <div className="flex gap-3">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" strokeWidth={2.2} />
                        <div>
                            <div className="text-xs font-bold">Document Requirements</div>
                            <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] font-medium">
                                <li>Files must be in JPG, PNG, or PDF format</li>
                                <li>Maximum file size: 5MB per document</li>
                                <li>Documents should be clear and readable</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-7 flex items-center justify-end gap-5 border-t border-[#E5E7EB] pt-3">
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