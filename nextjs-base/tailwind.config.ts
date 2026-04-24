import type { Config } from "tailwindcss";
import { fontFamily as defaultFontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const headingSizes = {
  h1: {
    fontSize: "5rem",
    lineHeight: "1.1",
    fontWeight: "700",
    letterSpacing: "0",
    md: { fontSize: "11rem", lineHeight: "0.9", letterSpacing: "-0.054em" },
  },
  h2: {
    fontSize: "3.2rem",
    lineHeight: "1",
    fontWeight: "700",
    letterSpacing: "0",
    md: { fontSize: "8.6rem", letterSpacing: "-0.047em" },
  },
  h2Plus: {
    fontSize: "4rem",
    lineHeight: "1",
    fontWeight: "700",
    letterSpacing: "0",
    md: { fontSize: "8.6rem", letterSpacing: "-0.047em" },
  },
  h3: {
    fontSize: "3.2rem",
    lineHeight: "1",
    fontWeight: "700",
    letterSpacing: "0",
    md: { fontSize: "7rem", lineHeight: "0.9", letterSpacing: "-0.057em" },
  },
  h3Small: {
    fontSize: "2.8rem",
    lineHeight: "1",
    fontWeight: "700",
    letterSpacing: "0",
    md: { fontSize: "7rem", lineHeight: "0.9", letterSpacing: "-0.057em" },
  },
  h4: {
    fontSize: "2.4rem",
    lineHeight: "1.2",
    fontWeight: "700",
    letterSpacing: "-0.12rem",
    md: { fontSize: "6rem", lineHeight: "1.1" },
  },
  h5: {
    fontSize: "2.0rem",
    lineHeight: "1.1",
    fontWeight: "700",
    letterSpacing: "0",
    md: { fontSize: "4rem", lineHeight: "1.1", letterSpacing: "-0.05em" },
  },
  h6: {
    fontSize: "2rem",
    lineHeight: "1.1",
    fontWeight: "700",
    letterSpacing: "-0.1rem",
    md: { fontSize: "3.2rem", lineHeight: "1" },
  },
  h7: {
    fontSize: "1.6rem",
    lineHeight: "1",
    fontWeight: "700",
    letterSpacing: "0",
    md: { fontSize: "2.4rem", lineHeight: "1", letterSpacing: "-0.042em" },
  },
  h8: {
    fontSize: "1.4rem",
    lineHeight: "1.2",
    fontWeight: "400",
    letterSpacing: "0",
    md: { fontSize: "2rem" },
  },
  h9: {
    fontSize: "1.6rem",
    lineHeight: "1",
    fontWeight: "500",
    letterSpacing: "-0.1rem",
    md: { fontSize: "1.8rem", lineHeight: "normal" },
  },
  h10: {
    fontSize: "1.4rem",
    lineHeight: "1.0",
    fontWeight: "500",
    letterSpacing: "0px",
    md: { fontSize: "3.0rem", lineHeight: "1.1" },
  },
  h12: {
    fontSize: "1.4rem",
    lineHeight: "1.2",
    fontWeight: "700",
    letterSpacing: "0px",
    md: {},
  },
};

const paragraphSizes = {
  p: {
    fontSize: "1.4rem",
    fontWeight: "400",
    lineHeight: "1.4",
    letterSpacing: "0",
    md: { fontSize: "1.6rem" },
  },
  small: {
    fontSize: "1.4rem",
    fontWeight: "400",
    lineHeight: "1.1",
    letterSpacing: "0",
    md: { fontSize: "1.4rem", letterSpacing: "0" },
  },
  p1: {
    fontSize: "1.6rem",
    fontWeight: "400",
    lineHeight: "1.4",
    letterSpacing: "0",
    md: {},
  },
  p2: {
    fontSize: "1.6rem",
    fontWeight: "400",
    lineHeight: "1.4",
    letterSpacing: "0",
    md: { fontSize: "1.8rem" },
  },
};

const menuSizes = {
  m1: {
    fontSize: "1.6rem",
    fontWeight: "700",
    lineHeight: "1",
    letterSpacing: "0",
    md: { fontSize: "2.0rem", fontWeight: "900" },
  },
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/page-templates/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        "in-cubic": "cubic-bezier(0.32, 0, 0.67, 0)",
        "out-cubic": "cubic-bezier(0.33, 1, 0.68, 1)",
        "in-out-cubic": "cubic-bezier(0.65, 0, 0.35, 1)",
        "in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
        "in-out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "out-back": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      transitionProperty: {
        "transform-opacity": "transform, opacity, visibility",
      },
      colors: {
        primary: { DEFAULT: "#071E38" },
        darkBlue: { DEFAULT: "#071E38", 100: "#0A4980", 200: "#C2D1DF" },
        lightBlue: {
          DEFAULT: "#27A6DA",
          50: "#D4EDF8",
          100: "#DAE9EF",
          200: "#A9DBF0",
          300: "#0A91C9",
          400: "#8AA8CA",
        },
        greyBlue: { DEFAULT: "#475A6E" },
        blue: { DEFAULT: "#0A4980", 200: "#004A84", 300: "#073D4F" },
        white: { DEFAULT: "#FFFF", 200: "#004A84", 300: "#073D4F" },
        green: { DEFAULT: "#196C75", 100: "#BAD3D6" },
        golden: { DEFAULT: "#F0B640", 100: "#F6EFD8", 200: "#D2AD3C" },
        brown: { DEFAULT: "#9B6445", 100: "#FFF5E9" },
        lightGreen: { DEFAULT: "#4EC3A8", 100: "#CAEDE5", 200: "#368976" },
        darkGreen: { DEFAULT: "#006068" },
      },
      fontFamily: {
        effra: ["effra", ...defaultFontFamily.sans],
      },
      height: {
        "screen-static": "calc(var(--static-vh, 1vh) * 100)",
      },
      screens: {
        xs: "375px",
        sm: "480px",
        md: "767px",
        lg: "991px",
        llg: "1025px",
        xl: "1200px",
        "2xl": "1300px",
        "3xl": "1440px",
        "4xl": "1500px",
        "5xl": "1600px",
        "6xl": "1800px",
        "7xl": "2000px",
      },
      rotate: {
        "24": "24deg",
        "36": "36deg",
        "55": "55deg",
        "125": "125deg",
        "150": "150deg",
        "165": "165deg",
      },

      clipPath: {
        slantTop: "polygon(0 0, 100% 33%, 100% 100%, 0 100%)",
      },

      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: "none", // removes default prose max-width
            ...Object.fromEntries(
              Object.entries({
                ...headingSizes,
                ...paragraphSizes,
                ...menuSizes,
              }).map(([key, value]) => [
                key,
                {
                  fontSize: value.fontSize,
                  lineHeight: value.lineHeight,
                  fontWeight: value.fontWeight,
                  letterSpacing: value.letterSpacing,
                  "@screen md": value.md,
                },
              ]),
            ),
          },
        },
      }),
      backgroundImage: {
        "gradient-from-bottom-black-100":
          "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
        "8xl": "6rem",
      },
      zIndex: Object.fromEntries(
        Array.from({ length: 9 }, (_, i) => [i + 1, `${i + 1}`]),
      ),
      duration: {
        600: "600ms",
      },
      keyframes: {
        "slide-duration": { from: { width: "0" }, to: { width: "100%" } },
        "slide-left-full": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "call-to-scroll": {
          "0%": {
            transform: "translateY(0)",
            "animation-timing-function": "linear", // expoIn
          },
          "50%": {
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0.7, 0, 0.84, 0)", // expoIn
          },
          "74.99%": {
            transform: "translateY(-120%)",
            "animation-timing-function": "linear",
          },
          "75%": {
            transform: "translateY(120%)",
            "animation-timing-function": "cubic-bezier(0.16, 1, 0.3, 1)", // expoOut
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "slide-duration": "slide-duration 8s linear",
        "slide-up-and-fade": "slide-up-and-fade 0.5s ease-out",
        "slide-left-full": "slide-left-full 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        slideUpAndFade:
          "slideUpAndFade var(--t-duration, 1000ms) cubic-bezier(0.16, 1, 0.3, 1) var(--t-delay, 0ms) forwards",
        slideDownAndFade:
          "slideDownAndFade var(--t-duration, 1000ms) cubic-bezier(0.16, 1, 0.3, 1) var(--t-delay, 0ms) forwards",
        "call-to-scroll": "call-to-scroll 2.6s infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-animate"),
    plugin(({ addComponents, addBase, addVariant, theme }) => {
      // ✅ Custom variants
      addVariant("hc", "html.hc &");
      addVariant("mac", "html.mac &");
      addVariant("windows", "html.windows &");

      // ✅ Base styles
      addBase({
        body: {
          margin: "0",
          background: theme("colors.lightBlue.100"),
        },
      });

      const components = Object.fromEntries(
        Object.entries({
          ...headingSizes,
          ...paragraphSizes,
          ...menuSizes,
        }).map(([key, value]) => {
          const selector = `${key}, .${key}`;

          return [
            selector,
            {
              fontSize: value.fontSize,
              lineHeight: value.lineHeight,
              fontWeight: value.fontWeight,
              letterSpacing: value.letterSpacing,
              [`@media (min-width: ${theme("screens.md")})`]: value.md,
            },
          ];
        }),
      );

      addComponents({
        ".secPad-x": {
          paddingLeft: theme("spacing.8"),
          paddingRight: theme("spacing.8"),
          "@screen md": {
            paddingLeft: theme("spacing.16"),
            paddingRight: theme("spacing.16"),
          },
          "@screen xl": {
            paddingLeft: theme("spacing.24"),
            paddingRight: theme("spacing.24"),
          },
        },
        ".text-1": {
          fontSize: "1.4rem",
          lineHeight: "1.1",
        },
        ".para-1": {
          fontSize: "1.6rem",
          lineHeight: "1.4",
        },
      });
      addComponents([components]);
    }),
  ],
};

export default config;