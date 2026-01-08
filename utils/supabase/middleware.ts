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

    const path = req.nextUrl.pathname

    // 1. If user is NOT logged in
    if (!user) {
        // Allow access to public paths
        if (
            path === '/' ||
            path.startsWith('/login') ||
            path.startsWith('/signup') ||
            path.startsWith('/forgot-password') ||
            path.startsWith('/auth') ||
            path.startsWith('/api')
        ) {
            return res
        }

        // Redirect unauthenticated users to root (Login) for protected routes
        const url = req.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // 2. If user IS logged in
    if (user) {
        // Redirect authenticated users away from public auth pages to dashboard
        if (
            path === '/' ||
            path.startsWith('/login') ||
            path.startsWith('/signup') ||
            path.startsWith('/forgot-password')
        ) {
            const url = req.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    }

    return res
}
