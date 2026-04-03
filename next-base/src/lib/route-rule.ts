import { GetSitemapData } from "@/lib/methods.server";
import { CommonPageRenderer } from "@/page-templates/CommonPageRenderer";
import { TLocale } from "@/typings/common";
import { RouteProps, SitemapPageData } from "@/typings/strapi";

const UNIQUE_LAYOUTS = ["news-detail"];

type Rule = {
  id: string;
  /** Returns true when this rule is the right one */
  match: (types: string[], last: string) => boolean;
  /** Query full page data (used by the route) */
  dataQuery: (slug: string, locale: TLocale) => Promise<any>;
  /** How to render the page in the route */
  render: (
    data: any,
    routes: RouteProps,
    slug: string,
    locale: string,
  ) => React.ReactElement | Promise<React.ReactElement>;
};

export const RULES: Rule[] = [
  {
    // sitemap / “default”
    id: "sitemap",
    match: (types, last) =>
      last === "default" ||
      (types.length === 1 && !UNIQUE_LAYOUTS.includes(last)),
    dataQuery: GetSitemapData,
    render: (data, routes) => CommonPageRenderer(data, routes),
  },
];

export function pickRule(types: string[], last: string) {
  const rule = RULES.find((r) => r.match(types, last)) ?? null;

  return rule;
}

export const getRouteURL = (slug: string, ParentPage: SitemapPageData) => {
  return ParentPage ? `/${ParentPage?.PageURL}/${slug}` : `/${slug}`;
};
