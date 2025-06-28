// app/api/blur/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    const buffer = await fetch(imageUrl).then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch image");
      return Buffer.from(await res.arrayBuffer());
    });

    const { base64 } = await getPlaiceholder(buffer);

    return NextResponse.json({ base64 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate blur" }, { status: 500 });
  }
}
