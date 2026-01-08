import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function updateSession(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
                    res = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        res.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (
        !user &&
        !req.nextUrl.pathname.startsWith('/login') &&
        !req.nextUrl.pathname.startsWith('/signup') &&
        !req.nextUrl.pathname.startsWith('/forgot-password') &&
        !req.nextUrl.pathname.startsWith('/auth') &&
        !req.nextUrl.pathname.startsWith('/api')
    ) {
        // no user, potentially respond by redirecting the user to the login page
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return res
}
