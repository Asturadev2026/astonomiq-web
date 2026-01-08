"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { LogOut, User, Settings, LifeBuoy, Menu } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Typography } from "@/components/ui/typography"

interface DashboardNavbarProps {
    onMenuClick?: () => void
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
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
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                    <Menu className="h-6 w-6 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-transparent" onClick={onMenuClick}>
                    <Menu className="h-6 w-6 text-gray-600" />
                </Button>

                <div className="bg-blue-700">
                    <Image
                        src="/logo.png"
                        alt="AstronomIQ Logo"
                        width={150}
                        height={32}
                        className="h-8 w-auto"
                        priority
                    />
                </div>

            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/avatars/01.png" alt="@user" />
                                <AvatarFallback className="bg-blue-50 text-blue-600 font-medium text-xs">JD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <Typography variant="label-md" as="p" className="font-bold leading-none">
                                    John Doe
                                </Typography>
                                <Typography variant="body-sm" as="p" className="leading-none text-muted-foreground">
                                    Administrator
                                </Typography>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span className="font-semibold">Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span className="font-semibold">Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            <span className="font-semibold">Support</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span className="font-semibold">Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}
