import createMetaData from "@/lib/createMetadata";
import { GetRoutes } from "@/lib/methods.server";
import { pickRule } from "@/lib/route-rule";
import { NextJSPageProps } from "@/typings/common";
import { RouteProps } from "@/typings/strapi";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// TODO: Add generateStaticParams

export async function generateMetadata({
  params,
}: NextJSPageProps): Promise<Metadata> {
  const { locale, pageSlug } = await params;

  const routes = await GetRoutes(pageSlug, locale);
  if (!routes?.data?.length || routes.data.length !== pageSlug?.length)
    return {};

  const lastItem = routes.data.at(-1);
  const lastPageSlug = pageSlug.at(-1);

  const meta = await createMetaData(
    lastItem?.PageType,
    locale,
    lastPageSlug as string,
  );

  if (!meta?.data?.length) return {};

  const page = meta.data[0];

  return {
    title: page?.SEO?.MetaTitle ?? page?.PageTitle,
    description: page?.SEO?.MetaDescription ?? page?.PageTitle,
    other: page?.SEO?.StructuredData
      ? { "application/ld+json": JSON.stringify(page.SEO.StructuredData) }
      : {},
  };
}

export default async function DynamicPage({ params }: NextJSPageProps) {
  const { locale, pageSlug } = await params;
  const routes: RouteProps = await GetRoutes(pageSlug, locale);
  if (!routes?.data?.length || routes.data.length !== pageSlug?.length) {
    return notFound();
  }

  const types = routes.data.map((r) => r.PageType);
  const lastType = types.at(-1)!;
  const lastSlug = pageSlug.at(-1)!;

  const rule = pickRule(types, lastType);
  if (!rule) return notFound();

  const data = await rule.dataQuery(lastSlug, locale);
  console.log("DynamicPage", data);

  if (!data) return notFound();

  const page = data?.data?.[0];

  return (
    <>
      {/* For SEO Structured Markup coming from the CMS */}
      {page?.SEO?.StructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(page?.SEO?.StructuredData),
          }}
        />
      )}
      {/* Rule Renderer for Dynamic Pages */}
      {rule.render(data, routes, lastSlug, locale)}
    </>
  );
}
