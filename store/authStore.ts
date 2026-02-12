import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware"; // Added persistence
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









interface State {
  _id: string | null;
  accessToken: string | null;
}

interface Action {
  setAccessToken: (_id: string, token: string ) => void;
  logOut: () => void;
}

const authStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        _id: null,
        accessToken: null,
        role: null,

        setAccessToken(_id: string, accessToken: string) {
          set(() => ({ _id, accessToken }));
        },

        logOut() {
          set({
            _id: null,
            accessToken: null,
          });
        },

      }),
      {
        name: "auth-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default authStore;
