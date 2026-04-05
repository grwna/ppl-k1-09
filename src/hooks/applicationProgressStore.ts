

import { create } from "zustand"
import { ApplicationProgress } from "@/types/application_progress"

type ApplicationProgressStore = {
    // these are the variables that the store store
    application_progress : ApplicationProgress | null

    // these are functions to call and define the create() section of zustand
    setStep : (step : number) => void
}

export const useApplicationProgressStore = create<ApplicationProgressStore>((set) => ({
    application_progress : null,
    
    setStep(step) {
        set({ application_progress : {step} })
    }
}))