import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ice: "#eef8fb",
        navy: "#10283b",
        blue: "#1677a8",
        lime: "#c8f169",
        rink: "#d9edf3",
      },
      boxShadow: {
        card: "0 12px 30px rgba(16, 40, 59, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
