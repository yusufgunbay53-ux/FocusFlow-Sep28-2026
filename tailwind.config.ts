import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#00d2ff",
        night: "#0b111e",
        panel: "rgba(16, 24, 40, 0.72)",
      },
      boxShadow: {
        glow: "0 0 24px rgba(0, 210, 255, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
