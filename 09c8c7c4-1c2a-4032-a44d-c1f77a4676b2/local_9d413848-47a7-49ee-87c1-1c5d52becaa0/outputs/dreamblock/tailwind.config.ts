import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        db: {
          bg: "#080810",
          surface: "#0F0F1A",
          surface2: "#14141F",
          border: "rgba(255,255,255,0.07)",
          text: "#E8E8F0",
          sub: "#8888A0",
          muted: "#4A4A60",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Helvetica Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
