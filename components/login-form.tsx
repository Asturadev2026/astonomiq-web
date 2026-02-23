"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Typography } from "@/components/ui/typography"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const loginSchema = z.object({
    orgId: z.string().min(1, "Please enter a valid Organization ID"),
    email: z.string().min(1, "Please enter a valid email").email("Please enter a valid email"),
    password: z.string().min(1, "Please enter your password"),
    rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            orgId: "",
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    React.useEffect(() => {
        // Check for pre-filled Org ID from signup
        const prefilledOrgId = localStorage.getItem("prefilledOrgId")
        if (prefilledOrgId) {
            setValue("orgId", prefilledOrgId)
            // Optional: Clear it so it doesn't persist forever, or keep it.
            // Let's keep it for now as it's a convenience.
            // localStorage.removeItem("prefilledOrgId") 
        }
    }, [setValue])

    async function onSubmit(data: LoginFormValues) {
    setLoading(true)

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error || 'Failed to login')
        }

        toast.success("Logged in successfully")

        // 🔥 CRITICAL FIX:
        // Force full reload so Supabase SSR session cookie hydrates properly
        window.location.href = "/dashboard"

    } catch (error) {
        console.error(error)
        toast.error(error instanceof Error ? error.message : "Failed to login")
    } finally {
        setLoading(false)
    }
}

    return (
        <div className="w-full max-w-[440px] p-8 bg-white rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="space-y-6">
                <Typography variant="h1" as="h1" className="text-2xl font-bold text-gray-900 tracking-tight">
                    Hospital Payment Reconciliation
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="org-id" className="text-sm font-medium text-gray-700">
                            Hospital Code / Organization ID
                        </Label>
                        <div className="relative">
                            <Input
                                id="org-id"
                                placeholder="e.g. HOS-2024-ND"
                                className={`h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${errors.orgId ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                    }`}
                                {...register("orgId")}
                            />
                            {errors.orgId && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                            )}
                        </div>
                        {errors.orgId && (
                            <Typography variant="label-sm" as="p" className="text-red-500 font-medium">
                                {errors.orgId.message}
                            </Typography>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                        </Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="finance@hospital.com"
                                className={`h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                    }`}
                                {...register("email")}
                            />
                            {errors.email && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                            )}
                        </div>
                        {errors.email && (
                            <Typography variant="label-sm" as="p" className="text-red-500 font-medium">
                                {errors.email.message}
                            </Typography>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                placeholder="**********"
                                className={`h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                    }`}
                                {...register("password")}
                            />
                            {errors.password && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                            )}
                        </div>
                        {errors.password && (
                            <Typography variant="label-sm" as="p" className="text-red-500 font-medium">
                                {errors.password.message}
                            </Typography>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                {...register("rememberMe")}
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember me
                            </label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-11 bg-[#007AFF] hover:bg-[#0069DB] text-white font-medium rounded-lg text-sm cursor-pointer">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In to Dashboard"
                        )}
                    </Button>

                    <div className="mt-4 text-center">
                        <span className="text-sm text-gray-600">Don&apos;t have an account? </span>
                        <Link
                            href="/signup"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-gray-500 font-medium">Need Help?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/support"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Contact Support Team
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
