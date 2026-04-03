import { get } from "@/lib/fetch";
import {
  FormCollection,
  RemoteConfigCollection,
  RouteCollection,
  SitemapCollection,
} from "@/lib/strapi";
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

const normalizeSitemapEntry = (entry: any): any => {
  if (!entry) {
    return entry;
  }

  return {
    ...entry,
    PageURL: entry.PageURL ?? entry.PageSlug,
    SEO: entry.SEO ?? entry.Seo,
    ParentPage: entry.ParentPage
      ? normalizeSitemapEntry(entry.ParentPage)
      : entry.ParentPage,
  };
};

// Routes Collection
export const GetRoutes = async (
  slugs: string[],
  locale: TLocale = "en",
): Promise<RouteProps> => {
  const data = (await RouteCollection.find({
    filters: {
      PageURL: {
        $in: slugs,
      },
    },
    locale: locale,
  })) as RouteProps;
  data?.data?.sort(
    (a, b) => slugs.indexOf(a?.PageURL) - slugs.indexOf(b?.PageURL),
  );
  return data;
};

// Global Config
export const GetRemoteConfig = async () => {
  "use cache";

  try {
    const data = (await RemoteConfigCollection.find()) as RemoteConfigProps;
    return data;
  } catch (error: any) {
    // Allow the app to boot when the single type has not been created/published yet.
    if (error?.response?.status === 404) {
      return {
        data: {
          id: 0,
          PageTitle: "",
          PageURL: "",
          SEO: {
            MetaTitle: "",
            MetaDescription: "",
            MetaRobots: "",
            StructuredData: {} as JSON,
          },
          documentId: "",
          createdAt: "",
          updatedAt: "",
          HeaderTrackingCodes: "",
          FooterTrackingCodes: "",
          GTMCode: "",
        },
        meta: {},
      } as RemoteConfigProps;
    }

    throw error;
  }
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
  console.log("data", data);

  return data;
};

export const GetSitemapMetaData = async (
  slug: string,
  locale: TLocale = "en",
) => {
  "use cache";
  const data = (await SitemapCollection.find({
    filters: {
      PageSlug: {
        $eq: slug,
      },
    },
    fields: ["PageTitle"],
    populate: {
      Seo: {
        populate: "*",
      },
    },
    locale,
  })) as SitemapPageProps;

  return {
    ...data,
    data: data?.data?.map(normalizeSitemapEntry),
  } as SitemapPageProps;
};

export const getSitemapSlugs = async (locale: TLocale) => {
  const data = await SitemapCollection.find({
    fields: ["PageSlug", "updatedAt", "ExcludeFromSitemap"],
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

  return {
    ...data,
    data: data?.data?.map(normalizeSitemapEntry),
  };
};

export const getNavigationMenu = async (
  slug: string,
  locale: TLocale = "en",
) => {
  const data: IHeaderNavItem[] = await get(`/api/navigation/render/${slug}`, {
    locale,
    // type: "TREE",
  });
  return data;
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
