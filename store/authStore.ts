import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface State {
  _id: string | null;
  accessToken: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

interface Action {
  setAccessToken: (_id: string, token: string, role?: string | null) => void;
  logOut: () => void;
}

const useAuthStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        _id: null,
        accessToken: null,
        role: null,
        isAuthenticated: false,

        setAccessToken(_id: string, accessToken: string, role: string | null = null) {
          set(() => ({ _id, accessToken, role, isAuthenticated: true }));
        },

        logOut() {
          set({
            _id: null,
            accessToken: null,
            role: null,
            isAuthenticated: false,
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
