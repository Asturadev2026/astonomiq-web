import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL =
  "https://asturaintelligence.app.n8n.cloud/webhook/reconciliation/run";

export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ Basic payload validation (prevents silent failures)
    if (!body || !body.files || !body.email) {
      return NextResponse.json(
        { error: "Missing email or files in request body" },
        { status: 400 }
      );
    }

    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await n8nRes.text();

    // ✅ Handle non-JSON responses safely
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!n8nRes.ok) {
      return NextResponse.json(
        {
          error: "n8n workflow failed",
          details: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      n8n: data,
    });
  } catch (error) {
    console.error("Reconciliation trigger failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
