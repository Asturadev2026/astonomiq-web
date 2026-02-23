import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/utils/supabase/supabase-admin"

export async function GET() {
  try {
    const supabaseAdmin = createSupabaseAdminClient()

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ users: data }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}