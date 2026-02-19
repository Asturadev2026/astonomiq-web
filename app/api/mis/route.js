import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(
      "https://asturaintelligence.app.n8n.cloud/webhook/mis-data",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`n8n responded with ${response.status}`);
    }

    const data = await response.json();

    // 🔥 RETURN EXACT RESPONSE (DON'T MODIFY STRUCTURE)
    return NextResponse.json(data);

  } catch (error) {
    console.error("MIS API error:", error);

    return NextResponse.json(
      { error: error?.message || "Failed to fetch MIS data" },
      { status: 500 }
    );
  }
}
