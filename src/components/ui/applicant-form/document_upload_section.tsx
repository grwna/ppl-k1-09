
import Image from "next/image";

import DocumentLogo from "../../../../public/document.svg"

import ApplicantForm_StudentIdCardUploadBlock from "./student_id_card_upload_block";
import ApplicantForm_FamilyCardUploadBlock from "./family_card_upload_block";

import { useApplicationProgressStore } from "@/hooks/applicationProgressStore";

export default function ApplicantForm_DocumentUploadSection() {

    const handleUpload = async () => {

        // construct the object to be sent
        const family_card_file = useApplicationProgressStore((state) => state.family_card)
        const student_id_card_file = useApplicationProgressStore((state) => state.student_id_card)
        
        if (!family_card_file || !student_id_card_file) return

        const formData = new FormData()
        formData.append("student_id_card_file", student_id_card_file)
        formData.append("family_card_file", family_card_file)

        await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })
    }

    return (
        // main container
        <div>

            {/* title */}
            <div>
                Document Upload
            </div>

            {/* caption */}
            <div>
                Please upload the required documents to verify your identity
            </div>

            {/* student id card / ktm container */}
            <div>

                {/* title */}
                <div>
                    Student ID Card (KTM)
                </div>

                {/* upload block */}
                <div>

                    <ApplicantForm_StudentIdCardUploadBlock />

                </div>

            </div>

            {/* family card container */}
            <div>

                {/* title */}
                <div>
                    Family Card (KK)
                </div>

                {/* upload block */}
                <div>

                    <ApplicantForm_FamilyCardUploadBlock />

                </div>

            </div>


            {/* document requirements */}
            <div className="flex justify-center items-center w-full h-fit">
                
                {/* symbols */}
                <div>
                    <Image 
                        src={DocumentLogo}
                        alt="Document Logo"
                    />
                </div>

                {/* content */}
                <div>
                    {/* title */}
                    <div>
                        Document Requirements
                    </div>

                    {/* points of document requirements */}
                    <div>
                        <ul>
                            <li>Files must be in JPG, PNG, or PDF format</li>
                            <li>Maximum file size: 5MB per document</li>
                            <li>Documents should be clear and readable</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* cta button */}
            <div className="flex w-full h-fit">

                {/* back button */}
                <div>
                    Back
                </div>

                {/* continue button */}
                <div onClick={handleUpload}>
                    Continue
                </div>
            </div>

        </div>
    );
}