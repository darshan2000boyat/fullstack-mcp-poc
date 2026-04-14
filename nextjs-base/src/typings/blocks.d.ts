import { CommonElement, DynamicZoneProps, ImageFragment, LinkProps, MediaProps } from "./common";
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

export interface HeroBannerProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Title: string;
  Subtitle: string;
  Media: MediaProps;
}

export interface AboutWithStatsProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Eyebrow: string;
  Heading: string;
  Description: string;
  Link: LinkProps;
  Stats: Array<{ number: string; label: string }>;
}

export interface PurposeStatementProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Eyebrow: string;
  Heading: string;
  Media: MediaProps;
}

export interface BusinessCardItemProps {
  id?: number;
  Title: string;
  Description?: string;
  Image: ImageFragment;
  Link?: LinkProps;
}

export interface BusinessGridProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Eyebrow: string;
  Heading: string;
  Link: LinkProps;
  Items: BusinessCardItemProps[];
}

export interface TestimonialProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Eyebrow: string;
  Quote: string;
  AuthorName: string;
  AuthorTitle: string;
}

export interface NewsCardItem {
  id?: number;
  Title: string;
  Date: string;
  Image: ImageFragment;
  Url: string;
}

export interface NewsGridProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Eyebrow: string;
  Heading: string;
  Link: LinkProps;
  NumberOfItems: number;
  NewsItems?: NewsCardItem[];
}
