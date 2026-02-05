import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    /* 1️⃣ Validate env */
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      return NextResponse.json(
        { error: "Google service account credentials missing" },
        { status: 500 }
      );
    }

    /* 2️⃣ Auth */
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    /* 3️⃣ Fetch sheet */
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1EfKHlx17rVz_UVpdyHiPGzSq7x1kE9Qnp_1zT2wCDFA",
      range: "Sheet1", // ✅ change if your tab name differs
    });

    /* 4️⃣ Safe access */
    const values = response?.data?.values;

    if (!Array.isArray(values) || values.length < 2) {
      // No data or only headers
      return NextResponse.json([]);
    }

    /* 5️⃣ Convert rows → objects */
    const headers = values[0];
    const rows = values.slice(1).map((row) => {
      const obj = {};
      headers.forEach((key, i) => {
        obj[key] = row?.[i] ?? "";
      });
      return obj;
    });

    /* 6️⃣ Always return array */
    return NextResponse.json(rows);

  } catch (err) {
    console.error("MIS API error:", err);

    return NextResponse.json(
      {
        error: err?.message || "Failed to fetch MIS data",
      },
      { status: 500 }
    );
  }
}
