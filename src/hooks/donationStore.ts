

import { create } from "zustand"
import { Donation } from "@/types/donation"

type DonationStore = {
    // these are the variables that the store store
    donation: Donation | null

    // these are functions to call and define the create() section of zustand
    setDonation: (value : number) => void
}

export const useDonationStore = create<DonationStore>((set) => ({
    donation : null,
    
    setDonation(value) {
        set({ donation : {value} })
    }
}))