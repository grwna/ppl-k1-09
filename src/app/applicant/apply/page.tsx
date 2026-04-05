
"use client"

import ApplicantForm_PersonalInformationSection from "@/components/ui/applicant-form/personal_information_section";
import ApplicantForm_FinancialNeedsSection from "@/components/ui/applicant-form/financial_needs_section";
import ApplicantForm_DocumentUploadSection from "@/components/ui/applicant-form/document_upload_section";
import ApplicantForm_TermsAndAgreementSection from "@/components/ui/applicant-form/terms_and_agreement_section";
import ApplicantForm_ApplicationProgressSection from "@/components/ui/applicant-form/application_progress_section";

import { useApplicationProgressStore } from "@/hooks/applicationProgressStore";
import ApplicantDashboard_ApplicantNavbar from "@/components/ui/applicant-dashboard/applicant_navbar";

export default function ApplyLoanFormPage(){

    const applicationProgress = useApplicationProgressStore((state) => (state.application_progress))

    return (
        // main container
        <div className="w-full h-full flex flex-col">

            {/* nav bar */}
            <div>
                <ApplicantDashboard_ApplicantNavbar />
            </div>

            {/* title */}
            <div className="flex justify-start items-center w-full h-fit">
                Student Loan Application
            </div>

            {/* caption */}
            <div className="flex justify-start items-center w-full h-fit">
                Complete all steps to submit your interest-free loan application
            </div>

            {/* main content container : application progress and those sections */}
            <div className="flex justify-between items-center w-full h-fit">

                {/* application progress */}
                <div className="flex justify-center items-center w-[40%] h-fit">
                    <ApplicantForm_ApplicationProgressSection />
                </div>

                {/* section */}
                <div className="flex justify-center items-center w-[60%] h-fit">

                    {/* personal information */}
                    { applicationProgress?.step == 1 && 
                        <div>
                            <ApplicantForm_PersonalInformationSection />   
                        </div>
                    }

                    {/* financial needs */}
                    { applicationProgress?.step == 2 && 
                        <div>
                            <ApplicantForm_FinancialNeedsSection />   
                        </div>
                    }

                    {/* document upload */}
                    { applicationProgress?.step == 3 && 
                        <div>
                            <ApplicantForm_DocumentUploadSection />   
                        </div>
                    }

                    {/* terms and agreement */}
                    { applicationProgress?.step == 4 && 
                        <div>
                            <ApplicantForm_TermsAndAgreementSection />   
                        </div>
                    }
                    
                </div>

            </div>


        </div>
    );
}