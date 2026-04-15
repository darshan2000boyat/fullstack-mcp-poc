import { CommonElement, DynamicZoneProps, MediaProps } from "./common";
import { SitemapPageData } from "./strapi";

export interface PageBlock {
  block?: DynamicZoneProps;
  page?: SitemapPageData;
}

export interface TestBlockProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Title: string;
  Media: MediaProps;
}
