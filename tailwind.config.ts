import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f8fafc",
          100: "#eef2f7",
          500: "#64748b",
          700: "#334155",
          950: "#05070d"
        },
        brand: {
          50: "#eef8ff",
          100: "#d9efff",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7"
        },
        mint: {
          400: "#34d399",
          500: "#10b981"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(2, 8, 23, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
