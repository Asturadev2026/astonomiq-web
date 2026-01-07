"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"

const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Please enter a valid email").email("Please enter a valid email"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    function onSubmit(data: ForgotPasswordFormValues) {
        console.log(data)
        // Handle reset password logic here
    }

    return (
        <div className="w-full max-w-[440px] p-8 bg-white rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="space-y-6">
                <Typography variant="h1" as="h1" className="text-2xl font-bold text-gray-900 tracking-tight">
                    Reset Password
                </Typography>

                <p className="text-sm text-gray-500">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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

                    <Button type="submit" className="w-full h-11 bg-[#007AFF] hover:bg-[#0069DB] text-white font-medium rounded-lg text-sm cursor-pointer">
                        Send Reset Link
                    </Button>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center justify-center gap-2"
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
