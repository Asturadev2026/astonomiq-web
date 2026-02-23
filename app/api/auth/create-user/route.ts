import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/utils/supabase/supabase-admin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, role, hospital_id } = body

    if (!email || !password || !role || !hospital_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabaseAdmin = createSupabaseAdminClient()

    // 1️⃣ Create user in Supabase Auth
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      )
    }

    if (!authUser.user) {
      return NextResponse.json(
        { error: "User creation failed" },
        { status: 500 }
      )
    }

    // 2️⃣ Insert into profiles table
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authUser.user.id,
        email,
        role,
        hospital_id,
      })

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Create user error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}