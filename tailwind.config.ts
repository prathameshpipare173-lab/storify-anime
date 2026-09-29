import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        anime: {
          dark: "#0b0f19",
          slate: "#131b2e",
          gold: "#f59e0b",
          sakura: "#f472b6",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          crimson: "#f43f5e",
        },
      },
      fontFamily: {
        anime: ["var(--font-cinematic)", "sans-serif"],
        japanese: ["var(--font-jp)", "serif"],
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(6, 182, 212, 0.45)",
        "neon-pink": "0 0 20px rgba(244, 114, 182, 0.45)",
        "neon-gold": "0 0 25px rgba(245, 158, 11, 0.45)",
        "neon-violet": "0 0 25px rgba(139, 92, 246, 0.45)",
        "dialogue-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.03)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
