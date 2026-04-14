import { get } from "@/lib/fetch";
import { FormCollection, RouteCollection, SitemapCollection } from "@/lib/strapi";
import { APIResponse, CommonCollectionData, TLocale } from "@/typings/common";
import { IHeaderNavItem } from "@/typings/header";
import {
  RemoteConfigProps,
  RouteProps,
  SitemapPageProps,
} from "@/typings/strapi";
import { draftMode } from "next/headers";

const previewHandler = (
  documentId: Pick<CommonCollectionData, "documentId">,
) => ({ documentId, status: "modified" });

// Routes Collection
export const GetRoutes = async (
  slugs: string[],
  locale: TLocale = "en",
): Promise<RouteProps> => {
  const data = ((await RouteCollection.find({
    filters: {
      PageURL: {
        $in: slugs,
      },
    },
    locale: locale,
  })) ?? { data: [] }) as RouteProps;
  data?.data?.sort(
    (a, b) => slugs.indexOf(a?.PageURL) - slugs.indexOf(b?.PageURL),
  );
  return data;
};

// Global Config
export const GetRemoteConfig = async () => {
  "use cache";
  const data = (await get("/api/remote-config")) as RemoteConfigProps | null;
  return data ?? ({ data: {} } as RemoteConfigProps);
};
// Sitemap Pages
export const GetSitemapData = async (slug: string, locale: TLocale = "en") => {
  const { isEnabled: isDraftMode } = await draftMode();

  // return data;
  const data: any = await get(
    "/api/sitemap/get-data",
    {
      slug,
      locale,
      status: isDraftMode ? "draft" : "published",
    },
    {},
    {
      tags: ["sitemap"],
    },
  );

  console.log(data, "TEST")
  return data;
};

export const GetSitemapMetaData = async (
  slug: string,
  locale: TLocale = "en",
) => {
  "use cache";
  const data = (await get("/api/sitemap/get-data", {
    slug,
    locale,
    status: "published",
  })) as SitemapPageProps | null;

  return data ?? ({ data: [] } as SitemapPageProps);
};

export const getSitemapSlugs = async (locale: TLocale) => {
  const data = await SitemapCollection.find({
    fields: ["PageURL", "updatedAt", "ExcludeFromSitemap"],
    locale,
    filters: {
      ExcludeFromSitemap: {
        $ne: true,
      },
    },
    populate: [
      "ParentPage",
      "ParentPage.ParentPage",
      "ParentPage.ParentPage.ParentPage",
    ],
    pagination: {
      limit: 1000,
    },
  });
  return data;
};

export const getNavigationMenu = async (
  slug: string,
  locale: TLocale = "en",
) => {
  const data = (await get(`/api/navigation/render/${slug}`, {
    locale,
    // type: "TREE",
  })) as IHeaderNavItem[] | null;
  return data ?? [];
};

export const getArticleCategories = async (
  options: object = {},
  locale: TLocale = "en",
) => {
  return {};
};

export const getNewsList = async (
  options: object = {},
  locale: TLocale = "en",
) => {
  return {};
};

export const getMultilingualSearchResults = async (
  filters: object,
  locale?: string,
) => {
  const data: APIResponse<any> = await get(
    "/api/strapi-v5-search-multilingual/search",
    {
      locale,
      ...filters,
    },
  );
  return data;
};

export const getForm = async (options: object, locale: TLocale = "en") => {
  const { isEnabled: isDraftMode } = await draftMode();
  const response = await FormCollection.find({
    locale,
    ...options,
    status: isDraftMode ? "draft" : "published",
  });
  return response;
};
