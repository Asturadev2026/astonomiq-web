import { NextResponse } from "next/server";

const N8N_CHAT_URL = process.env.N8N_CHAT_URL;

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body || !body.question) {
      return NextResponse.json(
        { error: "Missing question in request body" },
        { status: 400 }
      );
    }

    if (!N8N_CHAT_URL) {
      throw new Error("N8N_CHAT_URL is not configured");
    }

    const n8nRes = await fetch(N8N_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: body.question }),
    });

    const text = await n8nRes.text();

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

    return NextResponse.json(data);

  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}