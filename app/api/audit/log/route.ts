import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(req: Request) {
  try {

    const body = await req.json()

    const supabase = await createClient()

    const { error } = await supabase
      .from("audit_logs")
      .insert({
        email: body.email,
        action_type: body.action_type,
        entity: body.entity,
        record_count: body.record_count,
        description: body.description
      })

    if (error) {
      console.error("Audit insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error("Audit API error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}