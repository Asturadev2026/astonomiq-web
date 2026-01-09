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
import { Typography, typographyVariants } from "@/components/ui/typography"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const signupSchema = z.object({
    hospitalName: z.string().min(2, "Hospital name must be at least 2 characters"),
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Please enter a valid email").email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    rememberMe: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            hospitalName: "",
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            rememberMe: false,
        },
    })

    async function onSubmit(data: SignupFormValues) {
        setLoading(true)
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hospitalName: data.hospitalName,
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create account')
            }

            toast.success("Account created successfully!")
            // Save hospital ID to local storage for pre-filling login form
            localStorage.setItem("prefilledOrgId", result.hospitalCode)
            router.push('/login')

        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-[440px] p-8 bg-white rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="space-y-6">
                <Typography variant="h1" as="h1" className="text-2xl font-bold text-gray-900 tracking-tight">
                    Create an Account
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="hospital-name" className={typographyVariants({ variant: "label-md", className: "text-gray-700 font-semibold" })}>
                            Hospital Name
                        </Label>
                        <div className="relative">
                            <Input
                                id="hospital-name"
                                placeholder="e.g. City General Hospital"
                                className={`h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${errors.hospitalName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                    }`}
                                {...register("hospitalName")}
                                disabled={loading}
                            />
                            {errors.hospitalName && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                            )}
                        </div>
                        {errors.hospitalName && (
                            <Typography variant="label-sm" as="p" className="text-red-500 font-medium">
                                {errors.hospitalName.message}
                            </Typography>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="full-name" className={typographyVariants({ variant: "label-md", className: "text-gray-700 font-semibold" })}>
                            Full Name
                        </Label>
                        <div className="relative">
                            <Input
                                id="full-name"
                                placeholder="e.g. John Doe"
                                className={`h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                    }`}
                                {...register("fullName")}
                                disabled={loading}
                            />
                            {errors.fullName && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                            )}
                        </div>
                        {errors.fullName && (
                            <Typography variant="label-sm" as="p" className="text-red-500 font-medium">
                                {errors.fullName.message}
                            </Typography>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className={typographyVariants({ variant: "label-md", className: "text-gray-700 font-semibold" })}>
                            User Email
                        </Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="finance@hospital.com"
                                className={`h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                    }`}
                                {...register("email")}
                                disabled={loading}
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
                        <Label htmlFor="password" className={typographyVariants({ variant: "label-md", className: "text-gray-700 font-semibold" })}>
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
                                disabled={loading}
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

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password" className={typographyVariants({ variant: "label-md", className: "text-gray-700 font-semibold" })}>
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="**********"
                                className={`h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                                    }`}
                                {...register("confirmPassword")}
                                disabled={loading}
                            />
                            {errors.confirmPassword && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                            )}
                        </div>
                        {errors.confirmPassword && (
                            <Typography variant="label-sm" as="p" className="text-red-500 font-medium">
                                {errors.confirmPassword.message}
                            </Typography>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                {...register("rememberMe")}
                                disabled={loading}
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I agree to terms
                            </label>
                        </div>
                        <Link
                            href="/login"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Already have an account?
                        </Link>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-11 bg-[#007AFF] hover:bg-[#0069DB] text-white font-medium rounded-lg text-sm cursor-pointer">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>

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
