import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const tag = searchParams.get("tag");
  const secret = searchParams.get("secret");

  try {
    // Verify the secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: "Invalid secret token" },
        { status: 401 },
      );
    }

    // Revalidate by path or tag
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        message: `Path "${path}" revalidated successfully`,
        revalidated: true,
        type: "path",
        target: path,
        timestamp: new Date().toISOString(),
      });
    }

    if (tag) {
      // Next.js 16+: revalidateTag requires a second parameter (profile)
      // Using "max" for stale-while-revalidate semantics
      revalidateTag(tag, "max");
      return NextResponse.json({
        message: `Tag "${tag}" revalidated successfully`,
        revalidated: true,
        type: "tag",
        target: tag,
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
