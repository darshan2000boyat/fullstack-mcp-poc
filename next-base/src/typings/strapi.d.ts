import { APIResponse, CommonCollectionData, DynamicZoneProps } from "./common";

export interface SitemapPageData extends CommonCollectionData {
  publishedAt: string;
  locale: string;
  PageType: string;
  Disabled?: boolean;
  ParentPage: SitemapPageData;
  Blocks: DynamicZoneProps[];
}

export interface SitemapPageProps extends APIResponse<SitemapPageData[]> {}

export interface SitemapSinglePageProps extends APIResponse<SitemapPageData> {}

export interface RemoteConfigData extends CommonCollectionData {
  HeaderTrackingCodes: string;
  FooterTrackingCodes: string;
  GTMCode: string;
  Config?: {
    ConfigKey: string;
    ConfigValue: string;
  }[];
}

export interface RemoteConfigProps extends APIResponse<RemoteConfigData> {}

export interface RouteData {
  id: number;
  PageTitle: string;
  PageURL: string;
  PageType: string;
  PageCollectionType: string;
  PageDocumentID: string;
  documentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RouteProps extends APIResponse<RouteData[]> {}
