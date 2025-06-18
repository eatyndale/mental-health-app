import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSessionStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'session-storage',
    }
  )
);

export default useSessionStore; 