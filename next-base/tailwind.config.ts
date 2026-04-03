import type { Config } from "tailwindcss";
import {
  fontFamily as defaultFontFamily,
  screens,
} from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2B4F2B",
        },
        secondary: {
          DEFAULT: "#fef9ec",
        },
        tertiary: {
          DEFAULT: "#FFFDF9",
        },
        pineGreen: {
          DEFAULT: "#234840",
          100: "#D3DAD9",
          200: "#A7B6B3",
          300: "#7B918C",
          400: "#4F6D66",
          600: "#1C3A33",
          50: "#E9EDEC",
        },
        limeGreen: {
          DEFAULT: "#DDEB70",
          600: "#B1BC5A",
          400: "#4F6D66",
          50: "#E9EDEC",
        },
        earlyDawn: {
          DEFAULT: "#FDF5E0",
          200: "#FEFBF3",
        },
        salmonOrange: "#E57859",
        deepKhaki: {
          DEFAULT: "#C8A15E",
          200: "#E9D9BF",
        },
        kepple: "#52B399",
        teal: "#53B398",
        richGreen: "#02582E",
        neutral: "#E7E9E9",
        grey: "#81827D",
        surfaceColor: "#F6F2E7",
        red: {
          500: "#EE3039",
        },
      },
      fontFamily: {
        dubai: ["var(--font-dubai)", ...defaultFontFamily.sans],
        rakkas: ["var(--font-rakkas)", ...defaultFontFamily.sans],
      },
      height: {
        // you now get `h-screen-dynamic`
        "screen-static": "calc(var(--static-vh, 1vh) * 100)",
      },
      borderRadius: {
        xs: "0.4rem",
        sm: "0.8rem",
        md: "1.6rem",
        lg: "2rem",
        xl: "2.4rem",
        "2xl": "3.2rem",
        "3xl": "4rem",
        "4xl:": "5rem",
      },
      boxShadow: {
        xs: "0 1px 0 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        xl: "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "2xl":
          "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "3xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      keyframes: {
        "slide-duration": {
          from: { width: "0" },
          to: { width: "100%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical-decelerate": {
          "0%": { transform: "translateY(0)" },
          "10%": { transform: "translateY(calc(-80% - var(--gap)))" },
          "100%": { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
      animation: {
        "slide-duration": "slide-duration 8s linear",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "marquee-vertical-decelerate":
          "marquee-vertical-decelerate var(--duration) linear infinite",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.32, 0.08, 0.24, 1)",
        studio: "cubic-bezier(0.16, 1, 0.3, 1)",
        material: "cubic-bezier(0.4, 0, 0.2, 1)",
        "soft-out": "cubic-bezier(0.2, 0.8, 0.2, 1)",
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "expo-smooth": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      screens: {
        ...screens,
        xs: "360px",
        sm: "641px",
        md: "769px",
        "md-lg": "991px",
        lg: "1025px",
        al: "1181px", //ipad air landscape
        xl: "1281px",
        xxl: "1367px",
        "1xl": "1441px",
        // "2xl": "1641px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-animate"),
    plugin(({ addComponents, addBase, theme, addVariant }) => {
      addVariant("hc", "html.hc &");
      addVariant("mac", "html.mac &");
      addVariant("windows", "html.windows &");
      addBase({
        body: {
          margin: "0",
        },
      });
      addComponents({
        "h1, .h1": {
          fontSize: "7.2rem",
          lineHeight: "0.89",
          "@media only screen and (max-width: 767px)": {
            fontSize: "4rem",
            lineHeight: "1.1",
          },
        },
        "h2, .h2": {
          fontSize: "5.6rem",
          lineHeight: "1",
          "@media only screen and (max-width: 767px)": {
            fontSize: "3.2rem",
            lineHeight: "1.125",
          },
        },
        "h3, .h3": {
          fontSize: "4rem",
          lineHeight: "1.1",
          "@media only screen and (max-width: 767px)": {
            fontSize: "2.4rem",
            lineHeight: "1.25",
          },
        },
        "h4, .h4": {
          fontSize: "3.2rem",
          lineHeight: "1.125",
          "@media only screen and (max-width: 767px)": {
            fontSize: "2rem",
            lineHeight: "1.3",
          },
        },
        "h5, .h5": {
          fontSize: "2.4rem",
          lineHeight: "1.25",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.8rem",
            lineHeight: "1.222",
          },
        },
        "h6, .h6": {
          fontSize: "2rem",
          lineHeight: "1.2",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.6rem",
            lineHeight: "1.25",
          },
        },
        ".h7": {
          fontSize: "1.6rem",
          lineHeight: "1.5",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.4rem",
            lineHeight: "1.286",
          },
        },
        ".h8": {
          fontSize: "1.2rem",
          lineHeight: "1.33",
        },
        "p, .p": {
          fontSize: "1.6rem",
          lineHeight: "1.25",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.4rem",
            lineHeight: "1.286",
          },
        },
        ".small": {
          fontSize: "1.4rem",
          lineHeight: "1.285",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.2rem",
            lineHeight: "1.33",
          },
        },
        ".large": {
          fontSize: "1.8rem",
          lineHeight: "1.22",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.6rem",
            lineHeight: "1.25",
          },
        },
        ".xsmall": {
          fontSize: "1.2rem",
          lineHeight: "1.33",
        },
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
    }),
  ],
};
export default config;
