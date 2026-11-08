import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Kantumruy Pro"', '"Battambang"', "sans-serif"],
      },
      borderRadius: {
        xl: "var(--custom-radius)",
      },
      colors: {
        slate: {
          900: "var(--color-slate-900)",
          800: "var(--color-slate-800)",
          700: "var(--color-slate-700)",
        },
        blue: {
          950: "var(--color-blue-950)",
        },
        navy: {
          deep: "var(--color-navy-deep)",
        },
      },
    },
  },
};
