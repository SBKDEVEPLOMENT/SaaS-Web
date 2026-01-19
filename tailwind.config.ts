import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        fylo: {
          50: "#f4fbf7",
          100: "#e4f7eb",
          200: "#c2ebd1",
          300: "#92ddb1",
          400: "#4fc47f",
          500: "#1da765",
          600: "#158455",
          700: "#116545",
          800: "#0e4b36",
          900: "#093224"
        }
      }
    }
  },
  plugins: []
};

export default config;
