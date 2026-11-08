import { defineStore } from "pinia";
import type { UserRecord } from "~/server/database/schema";

export type AuthUser = Omit<UserRecord, "password">;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthUser | null,
    loading: false as boolean,
    initialized: false as boolean,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role || "",
    userName: (state) => state.user?.name || "",
    userAvatar: (state) => state.user?.avatar || "",
    userSubject: (state) => state.user?.subject || "",
    isTeacher: (state) => state.user?.role === "គ្រូបង្រៀន",
    isAdmin: (state) => state.user?.role === "អ្នកគ្រប់គ្រង",
  },

  actions: {
    async fetchUser() {
      this.loading = true;
      try {
        const headers = import.meta.server
          ? useRequestHeaders(["cookie"])
          : undefined;

        const res = await $fetch<{ success: boolean; user: AuthUser | null }>(
          "/api/auth/me",
          {
            headers: headers as Record<string, string>,
          }
        );
        if (res && res.success && res.user) {
          this.user = res.user;
          return res.user;
        } else {
          this.user = null;
          return null;
        }
      } catch {
        this.user = null;
        return null;
      } finally {
        this.loading = false;
        this.initialized = true;
      }
    },

    async login(email: string, pass: string) {
      this.loading = true;
      try {
        const res = await $fetch<{
          success: boolean;
          message: string;
          token: string;
          user: AuthUser;
        }>("/api/auth/login", {
          method: "POST",
          body: { email, password: pass },
        });

        if (res && res.success && res.user) {
          this.user = res.user;
          this.initialized = true;
          return res.user;
        }
      } finally {
        this.loading = false;
      }
    },

    async register(data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      role?: string;
      subject?: string;
    }) {
      this.loading = true;
      try {
        const res = await $fetch<{
          success: boolean;
          message: string;
          token: string;
          user: AuthUser;
        }>("/api/auth/register", {
          method: "POST",
          body: data,
        });

        if (res && res.success && res.user) {
          this.user = res.user;
          this.initialized = true;
          return res.user;
        }
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await $fetch("/api/auth/logout", { method: "POST" });
      } catch (e) {
        console.error("Logout error:", e);
      }
      this.user = null;
      await navigateTo("/login");
    },
  },
});
