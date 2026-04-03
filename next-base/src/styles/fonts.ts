import localFont from "next/font/local";

const dubai = localFont({
  src: [
    {
      path: "../assets/fonts/dubai/Dubai-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/dubai/Dubai-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/dubai/Dubai-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-dubai",
  preload: true,
});

const rakkas = localFont({
  src: [
    {
      path: "../assets/fonts/rakkas/Rakkas-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-rakkas",
  preload: true,
});

export { dubai, rakkas };
