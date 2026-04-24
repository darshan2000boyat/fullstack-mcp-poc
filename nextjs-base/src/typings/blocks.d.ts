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
  Stats: Array<{ id?: number; Number: string; Label: string }>;
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

export interface DivisionTabItem {
  id?: number;
  Label: string;
  IsActive: boolean;
}

export interface DivisionsProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  IndexText: string;
  Title: string;
  Description: string;
  Media: MediaProps;
  Tabs: DivisionTabItem[];
}

export interface FootprintMapProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Title: string;
  Subtitle: string;
  Countries: DivisionTabItem[];
}

export interface ContactInfoItem {
  id?: number;
  IconType: "email" | "phone" | "timings" | "location";
  Label: string;
  Value: string;
  Url?: string;
  Underline?: boolean;
}

export interface ContactUsProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Heading: string;
  ContactItems: ContactInfoItem[];
  FollowUsLabel: string;
  SocialLinks: LinkProps[];
  AddressImage: MediaProps;
  AddressLocationLabel: string;
  AddressText: string;
  AddressCTA: LinkProps;
  MapImage: MediaProps;
  MapLink?: LinkProps;
  DecorativeImage?: MediaProps;
}

export interface VisitOption {
  id?: number;
  Label: string;
  Value?: string;
}

export interface VisitSelector {
  id?: number;
  Variant: "primary" | "accent";
  Placeholder?: string;
  Options: VisitOption[];
}

export interface LetUsHelpYouProps {
  id?: number;
  __component?: string;
  Common: CommonElement;
  Eyebrow: string;
  HeadingPrefix: string;
  Connector1: string;
  Connector2: string;
  GroupSelector: VisitSelector;
  DurationSelector: VisitSelector;
  DateSelector: VisitSelector;
  CTA: LinkProps;
  BackgroundImage?: MediaProps;
  DecorativeImage?: MediaProps;
}
