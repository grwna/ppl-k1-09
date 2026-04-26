

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

    // document
    student_id_card : File | null
    family_card : File | null

    // terms and agreement
    comply_to_terms_and_agreement : boolean 

    // these are functions to call and define the create() section of zustand
    decrementStep : () => void
    incrementStep : () => void
    setStep : (step : number) => void

    // personal information
    setFullName : (full_name : string) => void
    setUniversityName : (university_name : string) => void
    setStudentIdNumber : (student_id_number : string) => void

    // financial needss
    setLoanTitle : (loan_title : string) => void
    setRequestedAmount : (requested_amount : number) => void
    setLoanPurpose : (loan_purpose : string) => void

    // document uploads
    setStudentIdCard : (student_id_card : File) => void
    setFamilyCard : (family_card : File) => void

    // terms and agreement
    switchComplyToTermsAndAgreement : () => void
}

export const useApplicationProgressStore = create<ApplicationProgressStore>((set, get) => ({
    application_progress : ({ step : 1}),
    
    // personal information
    full_name : "",
    university_name : "",
    student_id_number : "",
    
    // financial needs
    loan_title : "",
    requested_amount : 0,
    loan_purpose : "",
    
    // financial needs
    student_id_card : null,
    family_card : null,
    
    // terms and agreement
    comply_to_terms_and_agreement : false,

    decrementStep() {
        set((state) => {
            if (!state.application_progress) return state

            if (state.application_progress.step > 1) {
                return {
                    application_progress: {
                        ...state.application_progress,
                        step: state.application_progress.step - 1,
                    },
                }
            } else {
                return {
                    application_progress: {
                        ...state.application_progress,
                        step: state.application_progress.step,
                    },
                }
            }
        })
    },

    incrementStep() {
        set((state) => {
            if (!state.application_progress) return state

            if (state.application_progress.step < 4) {
                return {
                    application_progress: {
                        ...state.application_progress,
                        step: state.application_progress.step + 1,
                    },
                }
            } else {
                return {
                    application_progress: {
                        ...state.application_progress,
                        step: state.application_progress.step,
                    },
                }
            }
        })
    },

    setStep(step) {
        set((state) => {
            if (!state.application_progress) return state

            return {
                application_progress: {
                    ...state.application_progress,
                    step,
                },
            }
        })
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
    
    // document upload
    setStudentIdCard(student_id_card) {
        set({ student_id_card : student_id_card })
    },
    
    setFamilyCard(family_card) {
        set({ family_card : family_card })
    },

    // terms and agreement
    switchComplyToTermsAndAgreement() {
        set( { comply_to_terms_and_agreement : !get().comply_to_terms_and_agreement })
    },

}))