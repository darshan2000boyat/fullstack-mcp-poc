import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = request.headers.get("secret");

  try {
    // Verify the secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: "Invalid secret token" },
        { status: 401 },
      );
    }

    const payload = await request.json();

    if (payload?.model) {
      // Next.js 16+: revalidateTag requires a second parameter (profile)
      // Using "max" for stale-while-revalidate semantics
      revalidateTag(payload?.model, "max");
      return NextResponse.json({
        message: `Tag "${payload?.model}" revalidated successfully`,
        revalidated: true,
        type: "tag",
        target: payload?.model,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { message: 'Either "path" or "tag" parameter is required' },
      { status: 400 },
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Internal server error during revalidation" },
      { status: 500 },
    );
  }
}
