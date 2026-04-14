import { GetSitemapMetaData } from "@/lib/methods.server";
import { APIResponse, CommonCollectionData, TLocale } from "@/typings/common";

const createMetadata = async (
  PageType: string = "default",
  locale: TLocale,
  slug: string,
): Promise<APIResponse<CommonCollectionData[]>> => {
  switch (PageType) {
    case "news-listing":
    case "default":
      const response = await GetSitemapMetaData(slug, locale);
      return response as APIResponse<CommonCollectionData[]>;
    case "news-detail":
      return {} as APIResponse<CommonCollectionData[]>;
    default:
      return {} as APIResponse<CommonCollectionData[]>;
  }
};

export default createMetadata;
