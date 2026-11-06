import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    isCollapse: false,
    isMobile: false,
    isDark: false,
    sidebarWidth: "256px",
    collapsedSidebarWidth: "68px",
  }),

  getters: {
    currentWidth(state): string {
      return state.isCollapse
        ? state.collapsedSidebarWidth
        : state.sidebarWidth;
    },
  },

  actions: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse;
    },
    setMobileStatus(v: boolean) {
      this.isMobile = v;
      if (v) this.isCollapse = true;
    },
    toggleDark() {
      this.isDark = !this.isDark;
      if (import.meta.client) {
        document.documentElement.classList.toggle("dark", this.isDark);
        localStorage.setItem("theme", this.isDark ? "dark" : "light");
      }
    },
    initDark() {
      if (import.meta.client) {
        const stored = localStorage.getItem("theme");
        this.isDark = stored === "dark";
        document.documentElement.classList.toggle("dark", this.isDark);
      }
    },
  },
});
