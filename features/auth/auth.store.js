import { create } from "zustand";
import {
  getSession,
  onAuthStateChange,
  resetPassword,
  signInWithGoogle,
  signInWithPassword,
  signOut,
  signUpWithEmail,
} from "./auth.service";

let authSubscription = null;

export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  initialized: false,
  loading: false,
  error: null,

  hydrate: async () => {
    set({ loading: true, error: null });
    try {
      const session = await getSession();
      set({
        session,
        user: session?.user ?? null,
        initialized: true,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load auth session.",
        initialized: true,
        loading: false,
      });
    }
  },

  subscribe: () => {
    if (authSubscription) return authSubscription;
    const { data } = onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        initialized: true,
        loading: false,
        error: null,
      });
    });
    authSubscription = data.subscription;
    return authSubscription;
  },

  unsubscribe: () => {
    authSubscription?.unsubscribe();
    authSubscription = null;
  },

  signUpWithEmail: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await signUpWithEmail(payload);
      set({
        session: data.session ?? null,
        user: data.user ?? null,
        loading: false,
      });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign up.";
      set({ loading: false, error: message });
      throw error;
    }
  },

  signInWithPassword: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await signInWithPassword(payload);
      set({
        session: data.session ?? null,
        user: data.user ?? null,
        loading: false,
      });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in.";
      set({ loading: false, error: message });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const data = await signInWithGoogle();
      if (data?.session || data?.user) {
        set({
          session: data.session ?? null,
          user: data.user ?? null,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in with Google.";
      set({ loading: false, error: message });
      throw error;
    }
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const data = await resetPassword(email);
      set({ loading: false });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send reset email.";
      set({ loading: false, error: message });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await signOut();
      set({
        session: null,
        user: null,
        loading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign out.";
      set({ loading: false, error: message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
