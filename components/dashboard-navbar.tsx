"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { LogOut, User, Settings, LifeBuoy, Menu, Search, Bell, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import * as React from "react"

interface DashboardNavbarProps {
    onMenuClick?: () => void
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
    const router = useRouter()
    const supabase = createClient()
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    const notifications = [
        {
            title: "New Transaction",
            description: "Received payment of $450.00 from Patient #1234",
            time: "2 mins ago",
            unread: true,
        },
        {
            title: "System Update",
            description: "Dashboard maintenance scheduled for 2:00 AM",
            time: "1 hour ago",
            unread: false,
        },
        {
            title: "Report Generated",
            description: "Monthly reconciliation report is ready",
            time: "3 hours ago",
            unread: false,
        },
    ]

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
                <Button variant="ghost" size="icon" className="md:hidden cursor-pointer" onClick={onMenuClick}>
                    <Menu className="h-6 w-6 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-transparent cursor-pointer" onClick={onMenuClick}>
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

            {/* Middle - Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search transactions, files..."
                        className="pl-10 h-10 w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Date Selector */}
                <div className="hidden md:flex items-center border border-gray-200 rounded-lg p-1">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "h-8 justify-start text-left font-normal px-3 hover:bg-transparent"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-700">
                                    {date ? format(date, "MMM yyyy") : <span>Pick a date</span>}
                                </span>
                                <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block" />

                {/* Notifications */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative cursor-pointer">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm">Notifications</h4>
                                <span className="text-xs text-blue-600 font-medium cursor-pointer">Mark all as read</span>
                            </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.map((notification, index) => (
                                <div key={index} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notification.unread ? 'bg-blue-50/50' : ''}`}>
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{notification.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.description}
                                            </p>
                                            <p className="text-[10px] text-gray-400 pt-1">{notification.time}</p>
                                        </div>
                                        {notification.unread && (
                                            <div className="h-2 w-2 rounded-full bg-blue-600 mt-1" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-2 border-t border-gray-100 text-center">
                            <Button variant="ghost" size="sm" className="w-full text-xs text-gray-500 h-8">
                                View all notifications
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
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
