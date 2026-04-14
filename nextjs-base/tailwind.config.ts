import type { Config } from "tailwindcss";
import {
  fontFamily as defaultFontFamily,
  screens,
} from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/page-templates/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#002D73", //rgb(0, 45, 115)
          100: "#F2F6FF", //rgb(242, 246, 255)
          150: "#B1CFFF", //rgb(177, 207, 255)
          175: "#DFECFE", //rgb(223, 236, 254)
          200: "#0047BA", //rgb(0, 71, 186)
          250: "#C1D9FF", //rgb(193, 217, 255)
          300: "#085CE1", //rgb(8, 92, 225)
          700: "#1B2653", //rgb(27, 38, 83)
          800: "#012555", //rgb(1, 37, 85)
          900: "#022E75",
        },
        secondary: {
          DEFAULT: "#BD9E6D",
        },
        gray: {
          DEFAULT: "#333333",
          90: "#E5E5E5",
          50: "#27272780",
          100: "#D9D9D9",
          200: "#C5D0EB",
        },
      },
      fontFamily: {
        "red-hat-display": [
          "var(--font-red-hat-display)",
          ...defaultFontFamily.sans,
        ],
        mermaid: ["var(--font-mermaid)", ...defaultFontFamily.sans],
      },
      height: {
        // you now get `h-screen-dynamic`
        "screen-static": "calc(var(--static-vh, 1vh) * 100)",
      },
      backgroundImage: {
        "hero-overlay":
          "linear-gradient(180deg, rgba(26,40,87,0) 35.63%, rgba(27,38,83,0.66) 54.99%)",
        "overlay-gradient":
          "linear-gradient(174.38deg, #1B2653 4.48%, #0047BA 121.1%)",
        "footer-mobile-gradient":
          "linear-gradient(260.43deg, #1B2653 34.31%, #0047BA 101.16%)",
      },
      keyframes: {
        "slide-duration": {
          from: { width: "0" },
          to: { width: "100%" },
        },
        slideDown: {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0px" },
        },
        pulse1: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.3" },
          "50%": { transform: "scale(2)", opacity: "0.3" },
        },
        pulse2: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.5)", opacity: "0.4" },
        },
        carouselProgress: {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        "content-show": {
          from: {
            opacity: "0",
          },
          to: { opacity: "1" },
        },
        "content-hide": {
          from: {
            opacity: "1",
          },
          to: { opacity: "0" },
        },
        bannerTextIn: {
          from: { opacity: "0", transform: "translateY(2rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-duration": "slide-duration 8s linear",
        pulse1: "pulse1 2s ease-in-out infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.32, 0.08, 0.24, 1)",
        studio: "cubic-bezier(0.16, 1, 0.3, 1)",
        material: "cubic-bezier(0.4, 0, 0.2, 1)",
        "soft-out": "cubic-bezier(0.2, 0.8, 0.2, 1)",
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "expo-smooth": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      transitionDuration: {
        "250": "250ms",
      },
      transitionProperty: {
        "grid-rows": "grid-template-rows",
      },
      gridTemplateRows: {
        "0fr": "0fr",
        "1fr": "1fr",
      },
      aspectRatio: {
        square: "1 / 1",
        photo: "3 / 2",
        "photo-portrait": "2 / 3",
        landscape: "4 / 3",
        video: "16 / 9",
        phone: "9 / 16",
        cinema: "1.85 / 1",
        ultrawide: "18 / 5",
        card: "420 / 530",
      },
      screens: {
        ...screens,
        xs: "360px",
        sm: "641px",
        md: "769px",
        "md-lg": "991px",
        lg: "1025px",
        // al: "1181px", //ipad air landscape
        // xl: "1281px",
        // xxl: "1367px",
        // "1xl": "1441px",
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
        "h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6": {
          fontFamily: theme("fontFamily.mermaid"),
        },
        ".default-content": {
          "h1,h2,h3,h4,h5,h6": {
            color: theme("colors.primary.DEFAULT"),
            fontFamily: theme("fontFamily.red-hat-display"),
          },
          "ul,ol": {
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
            paddingLeft: "3rem",
          },
          ul: {
            listStyleType: "disc",
          },
          ol: {
            listStyleType: "decimal",
          },
          a: {
            color: theme("colors.primary.DEFAULT"),
            textDecoration: "underline",
          },
        },
        ".colored-heading": {
          "h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6": {
            color: theme("colors.primary.DEFAULT"),
          },
        },

        "h1, .h1": {
          fontSize: "8rem",
          lineHeight: "1.1",
          fontWeight: "700",
          "@media only screen and (max-width: 767px)": {
            fontSize: "3.2rem",
            lineHeight: "1.2",
          },
        },
        ".h1-banner": {
          fontSize: "8rem",
          lineHeight: "1.1",
          fontWeight: "700",
          "@media only screen and (max-width: 767px)": {
            fontSize: "4.4rem",
          },
        },
        ".h1-plus-1-super": {
          fontSize: "16rem",
          lineHeight: "1",
          fontWeight: "500",
          "@media only screen and (max-width: 1025px)": {
            fontSize: "10rem",
            lineHeight: "1.1",
            fontWeight: "500",
          },
        },
        ".h1-plus-1": {
          fontSize: "14rem",
          lineHeight: "1",
          fontWeight: "500",
          "@media only screen and (max-width: 1025px)": {
            fontSize: "8rem",
            lineHeight: "1.1",
            fontWeight: "500",
          },
        },
        ".h2-large": {
          fontSize: "6.4rem",
          lineHeight: "1.1",
          fontWeight: "700",
          "@media only screen and (max-width: 767px)": {
            fontSize: "4rem",
            lineHeight: "1.1",
          },
        },
        ".h2-large-2": {
          fontSize: "6.4rem",
          lineHeight: "1.1",
          fontWeight: "500",
        },
        ".h1-plus-2": {
          fontSize: "14rem",
          lineHeight: "1",
          fontWeight: "500",
          "@media only screen and (max-width: 1025px)": {
            fontSize: "6rem",
          },
        },
        "h2, .h2": {
          fontSize: "5rem",
          lineHeight: "1.2",
          fontWeight: "700",
          "@media only screen and (max-width: 767px)": {
            fontSize: "2.8rem",
            lineHeight: "1.1",
          },
          "@media only screen and (max-width: 648px)": {
            fontSize: "3.6rem",
            lineHeight: "1.1",
          },
        },
        ".h2-small": {
          fontSize: "4.8rem",
          lineHeight: "1.2",
          fontWeight: "700",
          "@media only screen and (max-width: 767px)": {
            fontSize: "2.8rem",
            lineHeight: "1.1",
          },
          "@media only screen and (max-width: 648px)": {
            fontSize: "3.6rem",
            lineHeight: "1.1",
          },
        },
        ".h3-large": {
          fontSize: "4rem",
          fontWeight: "600",
          lineHeight: "1.1",
          "@media only screen and (max-width: 767px)": {
            fontSize: "3rem",
            lineHeight: "1.2",
            fontWeight: "600",
          },
        },
        "h3, .h3": {
          fontSize: "3.6rem",
          fontWeight: "700",
          lineHeight: "1.1",
          "@media only screen and (max-width: 767px)": {
            fontSize: "2.2rem",
            lineHeight: "1.2",
            fontWeight: "600",
          },
        },
        "h4, .h4": {
          fontSize: "3rem",
          lineHeight: "1.1",
          fontWeight: "500",
          "@media only screen and (max-width: 767px)": {
            fontSize: "2rem",
            lineHeight: "1.2",
            fontWeight: "700",
          },
        },
        ".h5-large": {
          fontSize: "2.6rem",
          lineHeight: "1.2",
          fontWeight: "700",
          "@media only screen and (max-width: 767px)": {
            fontSize: "2rem",
            lineHeight: "1.1",
          },
        },
        "h5, .h5": {
          fontSize: "2.4rem",
          lineHeight: "1.2",
          fontWeight: "500",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.6rem",
            lineHeight: "1.1",
          },
        },
        ".h5-large-2": {
          fontSize: "2.4rem",
          lineHeight: "1.2",
          fontWeight: "600",
          "@media only screen and (max-width: 767px)": {
            fontSize: "2rem",
            lineHeight: "1.2",
          },
        },
        "h6, .h6": {
          fontSize: "1.8rem",
          lineHeight: "1.1",
          fontWeight: "500",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.4rem",
          },
        },
        "p,.p": {
          fontSize: "1.8rem",
          fontWeight: "400",
          lineHeight: "1.2",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.6rem",
            lineHeight: "1.3",
          },
        },
        li: {
          fontSize: "1.8rem",
          fontWeight: "500",
          lineHeight: "1.1",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.4rem",
          },
        },
        ".base": {
          fontSize: "1.6rem",
          fontWeight: "400",
          lineHeight: "1.4",
        },
        ".large": {
          fontSize: "2rem",
          fontWeight: "400",
          lineHeight: "1.2",
        },
        ".small": {
          fontSize: "1.4rem",
          fontWeight: "400",
          lineHeight: "1.2",
        },
        ".error-message": {
          fontSize: "1.2rem",
          fontWeight: "400",
          lineHeight: "1.2",
        },
        ".super-small": {
          fontSize: "1rem",
          fontWeight: "400",
          lineHeight: "1.2",
        },
        ".normal-title": {
          fontSize: "1.8rem",
          fontWeight: "500",
          lineHeight: "1.1",
          "@media only screen and (max-width: 767px)": {
            fontSize: "1.6rem",
          },
        },
        ".section-title h2": {
          fontFamily: theme("fontFamily.mermaid"),
          color: theme("colors.primary.DEFAULT"),
          fontWeight: "700",
          "@media only screen and (max-width: 767px)": {
            fontSize: "2.8rem",
          },
        },
        ".section-title:not(.default) h2": {
          fontSize: "8rem",
          lineHeight: "1.1",
        },
        ".section-title h3": {
          fontSize: "5rem",
          lineHeight: "1.2",
          fontWeight: "700",
          "@media only screen and (max-width: 767px)": {
            fontSize: "2.8rem",
          },
        },
        ".section-title  strong": {
          color: theme("colors.secondary.DEFAULT"),
        },
      });
    }),
  ],
};
export default config;
