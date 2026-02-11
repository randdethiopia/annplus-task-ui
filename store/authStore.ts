import { create } from "zustand";
import { persist } from "zustand/middleware"; // Added persistence
import type { Role } from "@/types/role";

type AuthState = {
    role: Role;
    hasHydrated: boolean; // Added for safety
    setRole: (role: Role) => void;
    setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            role: "admin",
            hasHydrated: false,
            setRole: (role) => set({ role }),
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);