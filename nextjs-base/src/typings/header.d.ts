import { ImageFragment } from "./common";

export interface IHeaderNavItem {
  id: number;
  title: string;
  menuAttached: boolean;
  order: number;
  path: string;
  type: string;
  uiRouterKey: string;
  slug: string;
  external: boolean;
  related: RelatedHeaderAttributes;
  items: IHeaderNavItem[];
  parent?: IHeaderNavItem;
  Icon?: ImageFragment;
  tag?: string;
  strict?: boolean;
  button_title?: string;
  route_disabled?: boolean;
  link_icon?: string;
  link_description?: string;
  link_path?: string;
  button_variant?: string;
  hide_on_login?: boolean;
  Image?: ImageFragment;
  Description?: string;
  additionalFields: {
    Image: ImageFragment;
  };
}

export interface GroupedNavItem {
  id: number;
  title: string;
  type: string;
  path: string;
  documentId?: string;
  additionalFields: {
    Image: ImageFragment;
  };
  parent?: GroupedNavItem;
  items?: GroupedNavItem[];
  // Add any other fields from your nav item as needed
}

export interface RelatedHeaderAttributes {
  id: number;
  PageId?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  locale: string;
  Title?: string;
  __contentType: string;
  navigationItemId: number;
  __templateName: string;
  PageTitle?: string;
  PageDescription?: string;
  PageSubtitle?: null;
  PageUid?: string;
  PageBreadcrumbTitle?: null;
  HidePageTitle?: null;
  Icon?: ImageFragment;
}

export interface HeaderData {
  data: HeaderDataDatum;
  meta: MetaData;
}

export interface HeaderDataDatum {
  MainMegaMenuImage: ImageFragment;
  // Add any other fields from your header data as needed
}
