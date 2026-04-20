import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#EEEDFE",
          100: "#CECBF6",
          500: "#534AB7",
          800: "#3C3489",
          900: "#26215C",
        },
      },
    },
  },
  plugins: [],
};

export default config;
