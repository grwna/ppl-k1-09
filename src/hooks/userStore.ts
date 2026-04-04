

import { create } from "zustand"

type User = {
    username : string,
    email : string,
}

type UserStore = {
    // these are the variables that the store store
    user: User | null

    // these are functions to call and define the create() section of zustand
    setUser: (u: User) => void
    logout : () => void

    isLoggedIn: () => boolean
}

export const useUserStore = create<UserStore>((set, get) => ({
    user : null,
    
    setUser(u) {
        set({ user : u })
    },

    logout() {
        set({ user : null})
    },

    isLoggedIn : () => get().user !== null,
}))