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
        /* Matches go.pospos.co font stack exactly */
        sans: ["'Noto Sans Thai'", "Sarabun", "'Source Sans Pro'", "'Helvetica Neue'", "Arial", "sans-serif"],
        sarabun: ["Sarabun", "sans-serif"],
        thai: ["'Noto Sans Thai'", "Sarabun", "sans-serif"],
      },
      colors: {
        /* Exact tokens from go.pospos.co CSS */
        sidebar: {
          DEFAULT: "#131820",   /* .sidebar-menu li.menu-items { background } */
          section: "#172944",   /* .sidebar-menu>li.menu-open>a { background } */
          text: "#728b97",      /* .sidebar-menu li.menu-items { color } */
          subtext: "#8aa4af",   /* .treeview-menu>li>a { color } */
          active: "#337ab7",    /* li.active>a { background } */
          heading: "#94a3b8",   /* .sidebar-menu>li.menu-open>a { color } */
        },
        navbar: "#0d6eb3",      /* .skin-blue .main-header .navbar { background } */
        "navbar-hover": "#128fe9", /* .sidebar-toggle:hover { background } */
        "logo-bg": "#1ca1e4",   /* .skin-blue .main-header .logo { background } */
        wrapper: "#edf1f5",     /* .content-wrapper { background } */
        /* POSPOS primary palette */
        "pp-primary": "#0d6eb3",
        "pp-danger": "#f2536e",
        "pp-success": "#0ea5e9",
        "pp-warning": "#efa43b",
      },
    },
  },
  plugins: [],
} satisfies Config;
