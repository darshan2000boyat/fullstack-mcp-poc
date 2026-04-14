import { i18n } from "@/app/locales/i18n.config";
import { getArticleCategories } from "@/lib/methods.server";
import { TLocale } from "@/typings/common";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const { locale = i18n.defaultLocale }: Record<string, any> =
    Object.fromEntries(searchParams.entries());

  const data = await getArticleCategories(req, locale as TLocale);

  return NextResponse.json({ data });
}
