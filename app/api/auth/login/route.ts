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

    // 🔥 ADD DEBUG LOGS HERE
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

    // ✅ Session cookie is automatically set by SSR client
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