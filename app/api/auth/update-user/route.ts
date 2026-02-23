import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/utils/supabase/supabase-admin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, email, role } = body

    if (!userId || !email || !role) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    const supabaseAdmin = createSupabaseAdminClient()

    // 1️⃣ Update email in auth.users
    const { error: authError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        email,
      })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      )
    }

    // 2️⃣ Update profile table
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ email, role })
      .eq("id", userId)

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}