"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    function toggleSidebar() {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardNavbar onMenuClick={toggleSidebar} />
            <div className="flex flex-1 relative">
                <DashboardSidebar isOpen={isSidebarOpen} />
                <main
                    className={cn(
                        "flex-1 p-6 transition-all duration-300 ease-in-out w-full overflow-x-hidden",
                        isSidebarOpen ? "ml-64" : "ml-[80px]"
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    )
}
