import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  try {

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)

    if (error) {
      console.error("Audit fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])

  } catch (err) {
    console.error("Audit API error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}