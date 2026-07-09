import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        background: "var(--background)",
        surface: "var(--surface)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          foreground: "var(--primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          foreground: "var(--muted-foreground)",
        },
        status: {
          draft: "var(--status-draft)",
          submitted: "var(--status-submitted)",
          assigned: "var(--status-assigned)",
          inProgress: "var(--status-in-progress)",
          resolved: "var(--status-resolved)",
          closed: "var(--status-closed)",
          rejected: "var(--status-rejected)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        lg: "8px",
        xl: "12px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
