import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // Extract date from query params
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    // Get URLs from environment variables
    const FETCH_ALL_URL = process.env.N8N_FETCH_ALL_URL;
    const FETCH_DATE_URL = process.env.N8N_FETCH_DATE_URL;

    if (!FETCH_ALL_URL || !FETCH_DATE_URL) {
      throw new Error("N8N fetch URLs are not configured");
    }

    // Build n8n URL
    const n8nUrl = date
      ? `${FETCH_DATE_URL}?date=${date}`
      : FETCH_ALL_URL;

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