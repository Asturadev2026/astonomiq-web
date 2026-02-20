import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // Extract date from query params
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    // Build n8n URL
    const n8nUrl = date
      ? `https://asturaintelligence.app.n8n.cloud/webhook/mis-data-fetch?date=${date}`
      : "https://asturaintelligence.app.n8n.cloud/webhook/mis-data";

    const response = await fetch(n8nUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`n8n responded with ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error("MIS API error:", error);

    return NextResponse.json(
      { error: error?.message || "Failed to fetch MIS data" },
      { status: 500 }
    );
  }
}
