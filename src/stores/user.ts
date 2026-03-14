import type { AuthState } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";





export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: ({ token, user = null }) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),


      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);