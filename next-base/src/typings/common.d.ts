// NEXTJS
export type TLocale = "en" | "ar";

export interface PagePrams {
  locale: TLocale;
  pageSlug: string[];
  slug: string;
}

export interface NextJSPageProps {
  params: Promise<PagePrams>;
}

export type Icon = SVGProps<SVGSVGElement>;

export interface FilterState {
  [key: string]: any;
}

// Strapi

export type UpdateStateFunction = (updates: Partial<FilterState>) => void;

export interface APIResponse<T> {
  data: T;
  meta?: {
    pagination?: Pagination;
  };
}

export interface CommonCollectionData {
  id: number;
  PageTitle: string;
  PageURL: string;
  SEO: SEOData;
  documentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface SEOData {
  MetaTitle: string;
  MetaDescription: string;
  MetaRobots: string;
  StructuredData: JSON;
}

export interface DynamicZoneProps {
  __component: string;
  [key: string]: any;
}

export interface CommonElement {
  HideBlock: boolean;
  BlockID: string;
  NoBottomMargin: string;
}

export interface LinkProps {
  id: number;
  Title: string;
  type?: string;
  url?: string;
  Icon?: ImageFragment;
}

export interface MediaProps {
  id: number;
  Image: ImageFragment;
  MobileImage: ImageFragment;
  VideoUrl?: string;
  MobileVideoUrl?: string;
  Description?: string;
}

export interface ImageFormatObject {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: any;
  size: number;
  width: number;
  height: number;
}

export interface ImageFormats {
  small?: ImageFormatObject;
  thumbnail?: ImageFormatObject;
  large?: ImageFormatObject;
  medium?: ImageFormatObject;
  placeholder?: ImageFormatObject;
  xsmall?: ImageFormatObject;
  xlarge?: ImageFormatObject;
}

export interface ImageFragment {
  documentId: string;
  id: number;
  name: string;
  alternativeText: any;
  caption: any;
  width: number;
  height: number;
  formats: ImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: any;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  placeholder: string;
}
