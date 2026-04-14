
"use client"

import localFont from "next/font/local";

import ApplicantForm_PersonalInformationSection from "@/components/ui/applicant-form/personal_information_section";
import ApplicantForm_FinancialNeedsSection from "@/components/ui/applicant-form/financial_needs_section";
import ApplicantForm_DocumentUploadSection from "@/components/ui/applicant-form/document_upload_section";
import ApplicantForm_TermsAndAgreementSection from "@/components/ui/applicant-form/terms_and_agreement_section";
import ApplicantForm_ApplicationProgressSection from "@/components/ui/applicant-form/application_progress_section";

import { useApplicationProgressStore } from "@/hooks/applicationProgressStore";
import ApplicantDashboard_ApplicantNavbar from "@/components/ui/applicant-dashboard/applicant_navbar";

const plusJakartaSansFont = localFont({
  src: '../../../../public/fonts/PlusJakartaSans-VariableFont.ttf',
  display: 'swap',
});

export default function ApplyLoanFormPage(){

    const applicationProgress = useApplicationProgressStore((state) => (state.application_progress))

    return (
        // main container
        <div className={`${plusJakartaSansFont.className} w-full h-full flex flex-col justify-center items-center p-2`}>

            {/* nav bar */}
            <div className="flex justify-center items-center w-full h-fit">
                <ApplicantDashboard_ApplicantNavbar />
            </div>

            {/* title container */}
            <div className={`flex justify-center items-center w-full h-fit text-3xl ${plusJakartaSansFont.className} p-4`}>
                {/* title */}
                <div className="flex justify-start items-center w-[60%] h-fit font-bold">
                    Student Loan Application
                </div>
            </div>

            {/* caption container */}
            <div className={`flex justify-center items-center w-full h-fit text-md ${plusJakartaSansFont.className} px-2 pb-2`}>
                {/* caption */}
                <div className="flex justify-start items-center w-[60%] h-fit">
                    Complete all steps to submit your interest-free loan application
                </div>
            </div>

            {/* main content container : application progress and those sections */}
            <div className="flex justify-center items-start w-full h-full gap-4">

                {/* application progress */}
                <div className="flex flex-col justify-center items-start h-full w-[20%] bg-white shadow-xl p-4 rounded-2xl">

                    {/* /title */}
                    <div className="flex justify-start items-center px-2 font-bold w-full h-fit">
                        Application Progress
                    </div>

                    {/* coontent */}
                    <div className="flex justify-center items-center h-fit w-full">
                        <ApplicantForm_ApplicationProgressSection />
                    </div>
                </div>

                {/* section */}
                <div className="flex justify-center items-center w-[40%] h-full">

                    {/* personal information */}
                    { applicationProgress?.step == 1 && 
                        <div className="flex justify-center items-center h-fit w-full">
                            <ApplicantForm_PersonalInformationSection />   
                        </div>
                    }

                    {/* financial needs */}
                    { applicationProgress?.step == 2 && 
                        <div className="flex justify-center items-center h-fit w-full">
                            <ApplicantForm_FinancialNeedsSection />   
                        </div>
                    }

                    {/* document upload */}
                    { applicationProgress?.step == 3 && 
                        <div className="flex justify-center items-center h-fit w-full">
                            <ApplicantForm_DocumentUploadSection />   
                        </div>
                    }

                    {/* terms and agreement */}
                    { applicationProgress?.step == 4 && 
                        <div className="flex justify-center items-center h-fit w-full">
                            <ApplicantForm_TermsAndAgreementSection />   
                        </div>
                    }
                    
                </div>

            </div>


        </div>
    );
}