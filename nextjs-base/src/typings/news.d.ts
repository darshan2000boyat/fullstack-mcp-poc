//
import {
  APIResponse,
  CommonCollectionData,
  DynamicZoneProps,
  MediaProps,
} from "./common";
import { MetaData, SitemapPageData } from "./strapi";

export interface NewsDataProps extends APIResponse<NewsData> {}
export interface NewsDataSingleProps extends APIResponse<NewsDataDatum> {}

export interface NewsData {
  data: NewsDataDatum[];
  meta: MetaData;
}

export interface NewsDataDatum extends CommonCollectionData {
  PublishedDate: string;
  Description: string;
  Thumbnail?: MediaProps;
  ParentPage: SitemapPageData;
  Blocks: DynamicZoneProps[];
}

//News Type
export interface NewsCategoryPropsProps
  extends APIResponse<NewsCategoryPropsData> {}
export interface NewsCategoryPropsDataSingleProps
  extends APIResponse<NewsCategoryPropsData> {}

export interface NewsCategoryPropsData {
  data: NewsCategoryDataDatum[];
  meta: MetaData;
}

export interface NewsCategoryDataDatum {
  id: number;
  Title: string;
  Slug: string;
}
