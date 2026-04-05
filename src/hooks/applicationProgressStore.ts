

import { create } from "zustand"
import { ApplicationProgress } from "@/types/application_progress"

type ApplicationProgressStore = {
    // these are the variables that the store store
    application_progress : ApplicationProgress | null

    // personal information
    full_name : string | null
    university_name : string | null
    student_id_number : string | null
    
    // financial needs
    loan_title : string | null
    requested_amount : number | null
    loan_purpose : string | null

    // these are functions to call and define the create() section of zustand
    setStep : (step : number) => void

    // personal information
    setFullName : (full_name : string) => void
    setUniversityName : (university_name : string) => void
    setStudentIdNumber : (student_id_number : string) => void

    // financial needss
    setLoanTitle : (loan_title : string) => void
    setRequestedAmount : (requested_amount : number) => void
    setLoanPurpose : (loan_purpose : string) => void
}

export const useApplicationProgressStore = create<ApplicationProgressStore>((set) => ({
    application_progress : null,
    
    // personal information
    full_name : null,
    university_name : null,
    student_id_number : null,
    
    // financial needs
    loan_title : null,
    requested_amount : null,
    loan_purpose : null,
    
    setStep(step) {
        set({ application_progress : {step} })
    },
    
    // personal information
    setFullName(full_name) {
        set({ full_name : full_name })
    },
    
    setUniversityName(university_name) {
        set({ university_name : university_name })
    },
    
    setStudentIdNumber(student_id_number) {
        set({ student_id_number : student_id_number })
    },
    
    // financial needs
    setLoanTitle(loan_title) {
        set({ loan_title : loan_title })
    },
    
    setRequestedAmount(requested_amount) {
        set({ requested_amount : requested_amount })
    },
    
    setLoanPurpose(loan_purpose) {
        set({ loan_purpose : loan_purpose })
    },


}))