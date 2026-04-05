

import { create } from "zustand"
import { ApplicationProgress } from "@/types/application_progress"

type ApplicationProgressStore = {
    // these are the variables that the store store
    application_progress : ApplicationProgress | null
    full_name : string | null
    university_name : string | null
    student_id_number : string | null

    // these are functions to call and define the create() section of zustand
    setStep : (step : number) => void
    setFullName : (full_name : string) => void
    setUniversityName : (university_name : string) => void
    setStudentIdNumber : (student_id_number : string) => void
}

export const useApplicationProgressStore = create<ApplicationProgressStore>((set) => ({
    application_progress : null,
    full_name : null,
    university_name : null,
    student_id_number : null,
    
    setStep(step) {
        set({ application_progress : {step} })
    },
    
    setFullName(full_name) {
        set({ full_name : full_name })
    },
    
    setUniversityName(university_name) {
        set({ university_name : university_name })
    },
    
    setStudentIdNumber(student_id_number) {
        set({ student_id_number : student_id_number })
    },


}))