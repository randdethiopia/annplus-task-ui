import { create } from "zustand";
import type { Role } from "@/types/role";

type AuthState = {
    role: Role;
    setRole: (role: Role) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    role: "admin",
    setRole: (role) => set({ role }),
}));