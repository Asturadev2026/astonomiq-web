import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseAdminClient } from '@/utils/supabase/supabase-admin'

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    hospitalName: z.string().min(2),
    fullName: z.string().min(2),
})

function generateHospitalCode() {
    const year = new Date().getFullYear()
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `HOS-${year}-${rand}`
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = signupSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            )
        }

        const { email, password, hospitalName, fullName } = result.data
        const supabaseAdmin = createSupabaseAdminClient()

        // 1️⃣ Create Auth User
        const { data: authData, error: authError } =
            await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
            })

        if (authError) {
            console.error(authError)
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        const userId = authData.user.id

        // 2️⃣ Generate Hospital Code
        const hospitalCode = generateHospitalCode()

        // 3️⃣ Create Hospital
        const { data: hospital, error: hospitalError } = await supabaseAdmin
            .from('hospitals')
            .insert({
                hospital_code: hospitalCode,
                name: hospitalName,
            })
            .select()
            .single()

        if (hospitalError) {
            console.error(hospitalError)

            // Rollback auth user if hospital creation fails
            await supabaseAdmin.auth.admin.deleteUser(userId)

            return NextResponse.json({ error: hospitalError.message }, { status: 400 })
        }

        // 4️⃣ Create Profile
        const { error: profileError } = await supabaseAdmin.from('profiles').insert({
            id: userId,
            email,
            hospital_id: hospital.id,
            role: 'admin',
            full_name: fullName,
        })

        if (profileError) {
            console.error(profileError)

            // Rollback everything
            await supabaseAdmin.from('hospitals').delete().eq('id', hospital.id)
            await supabaseAdmin.auth.admin.deleteUser(userId)

            return NextResponse.json({ error: profileError.message }, { status: 400 })
        }

        return NextResponse.json(
            {
                success: true,
                hospitalCode,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
