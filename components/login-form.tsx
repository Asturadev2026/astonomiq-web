"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
    return (
        <div className="w-full max-w-[440px] p-8 bg-white rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Hospital Payment Reconciliation
                </h1>

                <form className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="org-id" className="text-sm font-medium text-gray-700">
                            Hospital Code / Organization ID
                        </Label>
                        <Input
                            id="org-id"
                            placeholder="e.g. HOS-2024-ND"
                            className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            User Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="finance@hospital.com"
                            className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="**********"
                            className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
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

                    <Button type="submit" className="w-full h-11 bg-[#007AFF] hover:bg-[#0069DB] text-white font-medium rounded-lg text-sm">
                        Sign In to Dashboard
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
