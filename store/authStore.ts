import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware"; // Added persistence
import type { Role } from "@/types/role";

interface State {
  _id: string | null;
  accessToken: string | null;
}

interface Action {
  setAccessToken: (_id: string, token: string ) => void;
  logOut: () => void;
}

const useAuthStore = create<State & Action>()(
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

export default useAuthStore;
