import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { userId } = await req.json()

  await supabaseAdmin.auth.admin.deleteUser(userId)
  await supabaseAdmin.from("profiles").delete().eq("id", userId)

  return NextResponse.json({ success: true })
}