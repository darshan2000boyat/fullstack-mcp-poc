import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "./app/locales/i18n.config";

type RouteHandler = (
  req: NextRequest,
  context: { params: any },
) => Promise<NextResponse> | NextResponse;

const I18nMiddleware = createI18nMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  urlMappingStrategy: "rewriteDefault",
  resolveLocaleFromRequest: (req) => {
    const path = req.nextUrl?.pathname || req.url || "";
    const firstSegment = path.split("/")[1] as (typeof i18n.locales)[number];

    if (i18n.locales.includes(firstSegment)) {
      return firstSegment;
    }

    const cookieLocale = req.cookies.get("x-next-locale")
      ?.value as (typeof i18n.locales)[number];
    if (cookieLocale && i18n.locales.includes(cookieLocale)) {
      return cookieLocale;
    }

    return i18n.defaultLocale;
  },
});

export function proxy(request: NextRequest) {
  return I18nMiddleware(request);
}
export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};

export const validateReferer =
  (fn: RouteHandler) =>
  async (req: NextRequest, context: { params: any }): Promise<NextResponse> => {
    const referer = req.headers.get("referer") || req.headers.get("origin");
    if (!referer?.includes(process.env.NEXT_PUBLIC_SITE_URL as string)) {
      console.log("validation failed");
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 403,
        },
      );
    } else {
      return fn(req, context);
    }
  };
