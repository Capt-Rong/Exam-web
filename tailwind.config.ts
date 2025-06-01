import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [typography],
};

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-markdown/lib/react-markdown.js",
    // Or if using `src` directory:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: () => ({
        DEFAULT: {
          // This targets the base `prose` class
          css: {
            h1: {
              fontSize: "2.5rem", // 40px
              fontWeight: "700",
              lineHeight: "1.2",
              marginTop: "2em",
              marginBottom: "1em",
            },
            h2: {
              fontSize: "2rem", // 32px
              fontWeight: "600",
              lineHeight: "1.3",
              marginTop: "1.75em",
              marginBottom: "0.75em",
            },
            h3: {
              fontSize: "1.5rem", // 24px
              fontWeight: "600",
              lineHeight: "1.4",
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
            h4: {
              fontSize: "1.25rem", // 20px
              fontWeight: "600",
              lineHeight: "1.4",
              marginTop: "1.25em",
              marginBottom: "0.5em",
            },
            h5: {
              fontSize: "1.125rem", // 18px
              fontWeight: "600",
              lineHeight: "1.4",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            h6: {
              fontSize: "1rem", // 16px
              fontWeight: "600",
              lineHeight: "1.4",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
