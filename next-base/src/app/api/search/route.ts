import { getMultilingualSearchResults } from "@/lib/methods.server";
import { validateReferer } from "@/proxy";
import { NextRequest, NextResponse } from "next/server";

const GetHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const { page, pageSize, query, type, locale }: Record<string, any> =
    Object.fromEntries(searchParams.entries());

  const data = await getMultilingualSearchResults(
    {
      term: query,
      type,
      pagination: {
        page,
        pageSize,
      },
    },
    locale,
  );

  return NextResponse.json({ data });
};
export const GET = validateReferer(GetHandler);
