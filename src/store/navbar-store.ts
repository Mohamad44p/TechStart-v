import { create } from 'zustand'

type NavbarStore = {
  isFixed: boolean
  setFixed: (fixed: boolean) => void
  isProgram: boolean
  setIsProgram: (isProgram: boolean) => void
}

export const useNavbarStore = create<NavbarStore>((set) => ({
  isFixed: false,
  setFixed: (fixed) => set({ isFixed: fixed }),
  isProgram: false,
  setIsProgram: (isProgram) => set({ isProgram }),
}))
