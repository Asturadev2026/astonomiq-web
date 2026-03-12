import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {

    const body = await request.json()

    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email or password format' },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log(
      "KEY PREFIX:",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.slice(0, 20)
    )

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'Login failed. No session returned.' },
        { status: 401 }
      )
    }

    /* ================= AUDIT LOG INSERT ================= */

    try {

      const { data: profile } = await supabase
        .from("profiles")
        .select("id,email")
        .eq("email", email)
        .single()

      if (profile) {

        await supabase.from("audit_logs").insert({
          user_id: profile.id,
          email: profile.email,
          action_type: "LOGIN",
          entity: "AUTH",
          record_count: 0,
          description: "User logged into system"
        })

      }

    } catch (auditErr) {
      console.error("Audit log error:", auditErr)
    }

    /* ================= SUCCESS ================= */

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )

  } catch (err) {

    console.error('Login error:', err)

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}