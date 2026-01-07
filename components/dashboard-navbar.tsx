"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

export function DashboardNavbar() {
    const router = useRouter()
    const supabase = createClient()

    async function handleLogout() {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            router.push("/login")
            router.refresh()
            toast.success("Logged out successfully")
        } catch (error) {
            console.error("Logout error:", error)
            toast.error("Failed to log out")
        }
    }

    return (
        <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center bg-[#0080FF]">
                <Image
                    src="/logo.png"
                    alt="AstronomIQ Logo"
                    width={150}
                    height={32}
                    className="h-8 w-auto"
                    priority
                />
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 gap-2 font-medium cursor-pointer"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </nav>
    )
}
