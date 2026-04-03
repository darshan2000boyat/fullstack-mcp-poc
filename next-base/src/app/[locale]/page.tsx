import ExampleComponent from "@/components/blocks/ExampleComponent";
import FullBlockRendererPages from "@/components/blocks/FullBlockRenderer";
import { GetSitemapData, GetSitemapMetaData } from "@/lib/methods.server";
import { NextJSPageProps } from "@/typings/common";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: NextJSPageProps): Promise<Metadata> {
  const { locale } = await params;

  const response = await GetSitemapMetaData("homepage", locale);
  if (!response?.data?.length) {
    return {};
  }

  const page = response?.data?.[0];
  return {
    title: page?.SEO?.MetaTitle ?? page?.PageTitle,
    description: page?.SEO?.MetaDescription ?? page?.PageTitle,
    other: page?.SEO?.StructuredData
      ? {
          "application/ld+json": JSON.stringify(page?.SEO?.StructuredData),
        }
      : {},
  };
}

// Dynamic content component that uses draftMode()
async function HomePageContent({ locale }: { locale: string }) {
  const data = await GetSitemapData("homepage", locale as "en" | "ar");
  const page = data?.data?.[0];

  console.log(page, "aiousfds")

  if (!page) {
    return notFound();
  }
  return (
    <>
      <FullBlockRendererPages blocks={page?.attributes?.components} />
      {/* <ExampleComponent /> */}
    </>
  );
}

export default async function HomePage({ params }: Awaited<NextJSPageProps>) {
  const { locale } = await params;

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HomePageContent locale={locale} />
      </Suspense>
    </div>
  );
}
