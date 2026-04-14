import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-inter",
});

// const louis_george_cafe = localFont({
//   src: [
//     {
//       path: "../assets/fonts/louis-george-cafe/LouisGeorgeCafe-Light.woff2",
//       weight: "300",
//       style: "normal",
//     },
//     {
//       path: "../assets/fonts/louis-george-cafe/LouisGeorgeCafe-Regular.woff2",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "../assets/fonts/louis-george-cafe/LouisGeorgeCafe-Bold.woff2",
//       weight: "600",
//       style: "normal",
//     },
//   ],
//   variable: "--font-louis-george-cafe",
// });

export { inter };
