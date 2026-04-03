import { getSitemapSlugs } from "@/lib/methods.server";
import { getRouteURL } from "@/lib/utils";
import { getBaseUrl } from "@/utils/helpers";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const baseUrl = getBaseUrl();

    const [sitemapEN] = await Promise.all([getSitemapSlugs("en")]);

    // SITEMAP
    const sitemapUrlEN =
      sitemapEN?.data
        ?.filter((item: any) => !item?.ExcludeFromSitemap)
        ?.map((item) => {
          const URL = getRouteURL(item?.PageURL, item?.ParentPage);

          // const parentPage = trail?.map((e) => e?.link).join("/");
          // const URL = `${parentPage ? `/${parentPage}` : ""}/${item?.PageURL}`;

          return {
            url: `${baseUrl}${URL}`,
            lastModified: item?.updatedAt
              ? new Date(item?.updatedAt)
              : new Date(),
            changeFrequency: "weekly" as const,
            priority: 1,
          };
        }) || [];

    const convertToSitemapEntries = (
      data: any,
      priority: number = 0.5,
      parentFallback: string = "",
      multiParent: boolean = false,
    ) => {
      return (
        data?.data
          ?.filter(
            (item: any) => item && item.PageURL && !item.ExcludeFromSitemap,
          ) // Filter out invalid items first
          ?.map((item: any) => {
            const parentPage = !multiParent
              ? item?.ParentPage
              : item?.ParentPages?.[0];
            const URL = getRouteURL(item?.PageURL, parentPage);
            const fallbackParentUrl = !parentPage ? `/${parentFallback}` : "";

            return {
              url: `${baseUrl}${fallbackParentUrl}${URL}`,
              lastModified: item?.updatedAt
                ? new Date(item.updatedAt)
                : new Date(),
              changeFrequency: "weekly" as const,
              priority,
            };
          }) || []
      );
    };

    // Return minimal valid sitemap
    return [
      {
        url: `${getBaseUrl()}/`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 1,
      },
      ...sitemapUrlEN,
    ];
  } catch (error) {
    // Log the error for debugging
    console.error("Error in sitemap generation:", error);

    // Return a fallback sitemap
    return [
      {
        url: `${getBaseUrl()}/`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 1,
      },
    ];
  }
}
