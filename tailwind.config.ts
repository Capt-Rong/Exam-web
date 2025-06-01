import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
// import { listenerCount } from "process";
// import { markAssetError } from "next/dist/client/route-loader";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: () => ({
        DEFAULT: {
          // This targets the base `prose` class
          css: {
            h1: {
              fontSize: "2rem", // 40px
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
              fontSize: "1.2rem", // 18px
              fontWeight: "600",
              lineHeight: "1.4",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            h6: {
              fontSize: "1.125rem", // 16px
              fontWeight: "600",
              lineHeight: "1.4",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            p: {
              fontSize: "1rem",
              fontWeight: "400",
              lineHeight: "1.5",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            ul: {
              listStyleType: "disc",
              marginLeft: "1.5em",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            li: {
              listStyleType: "disc",
              marginLeft: "1.5em",
              marginTop: "0.5em",
              marginBottom: "0.5em",
              color: "#1E1E1E",
              fontSize: "1rem",
              fontWeight: "400",
              lineHeight: "1.5",
            },
            ol: {
              listStyleType: "decimal",
              marginLeft: "1.5em",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            code: {
              fontSize: "0.875rem",
              fontWeight: "400",
              lineHeight: "1.5",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            blockquote: {
              fontSize: "1rem",
              fontWeight: "400",
              lineHeight: "1.5",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            a: {
              color: "#007bff",
              textDecoration: "underline",
              "&:hover": {
                color: "#0056b3",
              },
            },
            img: {
              maxWidth: "100%",
              height: "auto",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            hr: {
              borderColor: "#e0e0e0",
              borderWidth: "1px",
              marginTop: "2em",
              marginBottom: "2em",
            },
            table: {
              width: "100%",
              marginTop: "1em",
              marginBottom: "0.5em",
            },
            thead: {
              backgroundColor: "#f0f0f0",
              "& th": {
                padding: "0.5em 1em",
                textAlign: "left",
              },
            },
            tbody: {
              "& tr": {
                "&:nth-child(even)": {
                  backgroundColor: "#f0f0f0",
                },
              },
            },
            pre: {
              fontSize: "0.875rem",
              fontWeight: "400",
              lineHeight: "1.5",
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
