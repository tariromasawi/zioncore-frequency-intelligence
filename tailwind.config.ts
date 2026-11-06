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
        zion: {
          void: "#06060c",
          deep: "#0d0b18",
          violet: "#7c3aed",
          amber: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
