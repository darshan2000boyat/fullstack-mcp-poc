import { updateSplashScreenCookie } from "@/app/actions";
import { getStaticParams } from "@/app/locales/server";
import AppProvider from "@/components/AppProvider";
import CookiePolicy from "@/components/elements/CookiePolicy";
import Header from "@/components/elements/header";
import { Toaster } from "@/components/ui/toaster";
import { GetRemoteConfig } from "@/lib/methods.server";
import { inter } from "@/styles/fonts";
import { TLocale } from "@/typings/common";
import { GoogleTagManager } from "@next/third-parties/google";
import { Metadata, Viewport } from "next";
import { setStaticParamsLocale } from "next-international/server";
import NextTopLoader from "nextjs-toploader";
import React from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000/",
  ),
  title: {
    template: "%s | Company Name",
    default: "Company Name",
  },
  description: "",
  authors: [
    {
      name: "TenTwenty | Webdesign, Webshops & E-marketing | Dubai",
    },
  ],
  openGraph: {
    siteName: "Company Name",
    title: "Company Name",
    description: "",
    images: [
      {
        url: "/logo.png",
        width: 910,
        height: 272,
      },
    ],
  },
  icons: {
    shortcut: "/favicon.ico",
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
} as const;

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function RootLayout({
  children,
  params,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale } = await params;
  const globalConfig = await GetRemoteConfig();
  setStaticParamsLocale(locale as TLocale);

  const splashStatusUpdate = async () => {
    "use server";
    updateSplashScreenCookie();
  };

  return (
    <html lang={locale}>
      {!Boolean(process.env.IS_UAT) && globalConfig?.data?.GTMCode ? (
        <GoogleTagManager gtmId={globalConfig?.data?.GTMCode} />
      ) : null}
      <body className={`${inter.variable} ${inter.className} overflow-x-clip`}>
        <NextTopLoader showSpinner={false} color="#C36520" />
        <AppProvider
          locale={locale}
          globalConfig={globalConfig?.data}
          splashStatusUpdate={splashStatusUpdate}
        >
          <Header />
          <CookiePolicy />
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
