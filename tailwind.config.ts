import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sarabun: ["Sarabun", "sans-serif"],
      },
      colors: {
        sidebar: {
          DEFAULT: "#172944",
          dark: "#0f1e33",
          active: "#337ab7",
          text: "#8aa4af",
          heading: "#94a3b8",
        },
        navbar: "#0d6eb3",
        wrapper: "#edf1f5",
      },
    },
  },
  plugins: [],
} satisfies Config;
