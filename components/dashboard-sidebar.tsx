"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutGrid,
    Upload,
    RefreshCw,
    FileText,
    BarChart3,
    History,
    Settings,
} from "lucide-react"
import { Typography } from "@/components/ui/typography"
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UploadDialogContent } from "@/components/upload-dialog-content"
import * as React from "react"

interface DashboardSidebarProps {
    isOpen: boolean
}

const sidebarItems = [
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
    { icon: RefreshCw, label: "Reconciliation", href: "/dashboard/reconciliation" },
    { icon: FileText, label: "Reports", href: "/dashboard/reports" },
    { icon: BarChart3, label: "MIS", href: "/dashboard/mis" },
    { icon: History, label: "Audit Trail", href: "/dashboard/audit-trail" },
    // Moved Upload to the end of the list as requested
    {
        icon: Upload,
        label: "Upload",
        href: "#", // No route, triggers modal
    },
]

export function DashboardSidebar({ isOpen }: DashboardSidebarProps) {
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                "fixed left-0 top-16 z-40 h-[calc(100vh-64px)] border-r border-gray-100 bg-white transition-all duration-300 ease-in-out pb-4 flex flex-col justify-between overflow-hidden",
                isOpen ? "w-64" : "w-[80px]"
            )}
        >
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="grid gap-1 px-4">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href

                        if (item.label === "Upload") {
                            return (
                                <Dialog key={index}>
                                    <DialogTrigger asChild>
                                        <button
                                            className={cn(
                                                "flex w-full items-center rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer",
                                                !isOpen && "justify-center px-0"
                                            )}
                                            title={!isOpen ? item.label : undefined}
                                        >
                                            <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
                                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                                <div className={cn("transition-all duration-200 overflow-hidden", !isOpen && "w-0 opacity-0 hidden")}>
                                                    <Typography variant="body-md" className="font-medium whitespace-nowrap">
                                                        {item.label}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </button>
                                    </DialogTrigger>
                                    <UploadDialogContent />
                                </Dialog>
                            )
                        }

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900",
                                    isActive && "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600",
                                    !isOpen && "justify-center px-0"
                                )}
                                title={!isOpen ? item.label : undefined}
                            >
                                <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <div className={cn("transition-all duration-200 overflow-hidden", !isOpen && "w-0 opacity-0 hidden")}>
                                        <Typography variant="body-md" className="font-medium whitespace-nowrap">
                                            {item.label}
                                        </Typography>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="px-4 py-4 border-t border-gray-100">
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        "flex items-center rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900",
                        pathname === "/dashboard/settings" && "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600",
                        !isOpen && "justify-center px-0"
                    )}
                    title={!isOpen ? "Settings" : undefined}
                >
                    <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        <div className={cn("transition-all duration-200 overflow-hidden", !isOpen && "w-0 opacity-0 hidden")}>
                            <Typography variant="body-md" className="font-medium whitespace-nowrap">
                                Settings
                            </Typography>
                        </div>
                    </div>
                </Link>
            </div>
        </aside>
    )
}

