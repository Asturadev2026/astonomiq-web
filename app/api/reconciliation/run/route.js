import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_RECON_URL;

export async function POST(req) {
  try {
    if (!N8N_WEBHOOK_URL) {
      throw new Error("N8N_RECON_URL is not configured");
    }

    // ✅ Read multipart form data
    const formData = await req.formData();

    const his = formData.get("his");
    const paytm = formData.get("paytm");
    const bank = formData.get("bank");
    const email = formData.get("email");

    if (!his || !paytm || !bank || !email) {
      return NextResponse.json(
        { error: "Missing required files or email" },
        { status: 400 }
      );
    }

    // Forward the same FormData to n8n
    const forwardForm = new FormData();
    forwardForm.append("his", his);
    forwardForm.append("paytm", paytm);
    forwardForm.append("bank", bank);
    forwardForm.append("email", email);

    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      body: forwardForm, // ⚠️ DO NOT set Content-Type
    });

    const text = await n8nRes.text();

    if (!n8nRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: text || "n8n workflow failed",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Files forwarded to n8n successfully",
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