import { getCurrentLocale } from "@/app/locales/server";
import { getNewsList } from "@/lib/methods.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { query, page, pageSize, sort, category }: Record<string, any> =
    Object.fromEntries(searchParams.entries());
  const locale = await getCurrentLocale();

  const filters: Record<string, any> = {};

  if (!!query) {
    filters["Title"] = {
      $containsi: query,
    };
  }

  if (!!category) {
    filters["articleCategory"] = {
      Key: {
        $eq: category,
      },
    };
  }

  const data = await getNewsList(
    {
      filters,
      sort: [sort],
      pagination: {
        pageSize,
        page,
      },
    },
    locale,
  );

  return NextResponse.json({ data });
}
