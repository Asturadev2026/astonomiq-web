import Image from "next/image"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { Typography } from "@/components/ui/typography"

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row">
            {/* Left side - Branding & Graphics */}
            <div className="relative w-full lg:w-1/2 bg-[#007AFF] flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden">
                <div className="w-full max-w-lg z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                    {/* Logo */}
                    <div className="mb-12">
                        <Image
                            src="/logo.png"
                            alt="AstronomIQ Logo"
                            width={180}
                            height={40}
                            className="h-10 w-auto"
                            priority
                        />
                    </div>

                    {/* Headline */}
                    <Typography variant="h1" as="h1" className="text-white mb-4 leading-tight">
                        Automated Payment Reconciliation
                        <br />
                        For Modern Hospitals
                    </Typography>

                    {/* Subheading */}
                    <Typography variant="body-lg" as="p" className="text-blue-100 mb-12 max-w-md">
                        Seamlessly reconcile HIS, Bank, UPI, and Cash transactions with enterprise-grade precision.
                    </Typography>

                    {/* Graphics Image */}
                    <div className="relative w-full aspect-square max-w-[500px]">
                        <Image
                            src="/login-graphics.png"
                            alt="Reconciliation Diagram"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="absolute bottom-8 left-8 lg:left-12 text-blue-200 text-xs">
                    © 2024 AstronomIQ. All rights reserved.
                </div>
            </div>

            {/* Right side - Forgot Password Form */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-6 lg:p-12 min-h-[600px]">
                <ForgotPasswordForm />

                {/* Placeholder Footer */}
                <div className="mt-12 w-full text-center text-gray-400 text-sm">
                    {/* Placeholder footer content as requested */}
                    Footer content goes here
                </div>
            </div>
        </div>
    )
}
