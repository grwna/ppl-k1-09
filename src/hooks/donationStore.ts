

import { create } from "zustand"
import { Donation } from "@/types/donation"

type DonationStore = {
    donation: Donation
    step : number

    setAmount: (amount: number) => void
    setPaymentMethod: (payment_method: string) => void
    setVABank: (va_bank: string) => void
}

export const useDonationStore = create<DonationStore>((set) => ({
    donation: {
        amount: 0,
        payment_method: "",
        va_bank: ""
    },
    step : 1,

    setAmount: (amount) =>
        set((state) => ({
            donation: {
                ...state.donation,
                amount,
            }
        })),

    setPaymentMethod: (payment_method) =>
        set((state) => ({
            donation: {
                ...state.donation,
                payment_method,
            },
        })),

    setVABank: (va_bank) =>
        set((state) => ({
            donation: {
                ...state.donation,
                va_bank,
            },
        })),
}))