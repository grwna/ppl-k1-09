
import Image from "next/image";

import DocumentLogo from "../../../../public/document.svg"

import ApplicantForm_StudentIdCardUploadBlock from "./student_id_card_upload_block";
import ApplicantForm_FamilyCardUploadBlock from "./family_card_upload_block";

import { useApplicationProgressStore } from "@/hooks/applicationProgressStore";

export default function ApplicantForm_DocumentUploadSection() {

    const incrementStep = useApplicationProgressStore((state) => state.incrementStep)
    const decrementStep = useApplicationProgressStore((state) => state.decrementStep)

    const handleBack = async () => {
        decrementStep()
    }

    const handleContinue = async () => {
        incrementStep()
    }

    return (
        // main container
        <div className="flex flex-col justify-center items-start gap-2 h-full w-full bg-white p-4 rounded-2xl">

            {/* title */}
            <div className="flex w-full h-fit font-bold text-2xl">
                Unggah Dokumen
            </div>

            {/* caption */}
            <div className="flex w-full h-fit font-light text-sm">
                Harap unggah dokumen yang diperlukan untuk melakukan verifikasi identitas Anda
            </div>

            {/* student id card / ktm container */}
            <div className="flex flex-col w-full h-fit gap-2">

                {/* title */}
                <div className="flex w-full h-fit justify-start items-center font-bold">
                    Kartu Tanda Mahasiswa (KTM)
                </div>

                {/* upload block */}
                <div className="flex justify-center items-center w-full h-fit p-2">
                    <ApplicantForm_StudentIdCardUploadBlock />
                </div>

            </div>

            {/* family card container */}
            <div className="flex flex-col w-full h-fit gap-2">

                {/* title */}
                <div className="flex w-full h-fit justify-start items-center font-bold">
                    Kartu Keluarga (KK)
                </div>

                {/* upload block */}
                <div className="flex justify-center items-center w-full h-fit p-2">
                    <ApplicantForm_FamilyCardUploadBlock />
                </div>

            </div>


            {/* document requirements */}
            <div className="flex w-full h-fit gap-2 justify-center items-center bg-[#FFF085]/70 p-2 rounded-2xl">
                
                {/* symbols */}
                <div className="w-[10%] h-full justify-center items-start">
                    <Image 
                        src={DocumentLogo}
                        alt="Document Logo"
                        className="flex justify-center items-center w-full h-fit"
                        width={5}
                        height={5}
                    />
                </div>

                {/* content */}
                <div className="w-[90%] h-fit justify-start items-center">
                    {/* title */}
                    <div className="w-full h-fit font-bold">
                        Syarat Dokumen
                    </div>

                    {/* points of document requirements */}
                    <div className="w-full h-fit justify-start items-center text-xs">
                        <ul >
                            <li className="py-0.5">Berkas harus dalam format JPG, PNG, atau PDF</li>
                            <li className="py-0.5">Ukuran maksimum berkas adalah 5MB per berkas</li>
                            <li className="py-0.5">Berkas harus jelas dan dapat dibaca</li>
                        </ul>
                    </div>
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
