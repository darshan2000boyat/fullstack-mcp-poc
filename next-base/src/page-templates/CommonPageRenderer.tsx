import FullBlockRendererPages from "@/components/blocks/FullBlockRenderer";
import { getRouteURL } from "@/lib/route-rule";
import { RouteProps, SitemapPageProps } from "@/typings/strapi";
import { notFound } from "next/navigation";

export const CommonPageRenderer = (
  pageData: SitemapPageProps,
  routes: RouteProps,
) => {
  if (!pageData) return notFound();
  const page = pageData?.data?.[0];

  if (!page) return notFound();

  const routeURL = getRouteURL(page?.PageURL, page?.ParentPage);

  return (
    <>
      {routeURL && routeURL}
      {/* Place full block renderer here */}
      <FullBlockRendererPages blocks={page?.Blocks} />
    </>
  );
};
