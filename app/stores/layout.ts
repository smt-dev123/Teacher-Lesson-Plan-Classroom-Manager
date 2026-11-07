import { defineStore } from "pinia";

interface AcademicYear {
  label: string;
  value: string;
}

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    isCollapse: false,
    isMobile: false,
    isDark: false,
    sidebarWidth: "256px",
    collapsedSidebarWidth: "68px",

    // Academic year
    academicYear: "2024-2025" as string,
    academicYears: [
      { label: "2023 - 2024", value: "2023-2024" },
      { label: "2024 - 2025", value: "2024-2025" },
      { label: "2025 - 2026", value: "2025-2026" },
      { label: "2026 - 2027", value: "2026-2027" },
    ] as AcademicYear[],

    // Language / Locale
    locale: "km" as string,
    locales: [
      { code: "km", label: "ភាសាខ្មែរ", flag: "🇰🇭", short: "KH" },
      { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
    ],
  }),

  getters: {
    currentWidth(state): string {
      return state.isCollapse
        ? state.collapsedSidebarWidth
        : state.sidebarWidth;
    },
    currentAcademicYearLabel(state): string {
      const y = state.academicYears.find((x) => x.value === state.academicYear);
      return y?.label || state.academicYear;
    },
    currentLocaleItem(state) {
      return state.locales.find((l) => l.code === state.locale) || state.locales[0];
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

    setAcademicYear(value: string) {
      this.academicYear = value;
      if (import.meta.client) {
        localStorage.setItem("academicYear", value);
      }
    },

    initAcademicYear() {
      if (import.meta.client) {
        const stored = localStorage.getItem("academicYear");
        if (stored && this.academicYears.some((y) => y.value === stored)) {
          this.academicYear = stored;
        }
      }
    },

    setLocale(code: string) {
      this.locale = code;
      if (import.meta.client) {
        localStorage.setItem("locale", code);
      }
    },

    initLocale() {
      if (import.meta.client) {
        const stored = localStorage.getItem("locale");
        if (stored && this.locales.some((l) => l.code === stored)) {
          this.locale = stored;
        }
      }
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
