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
    ChevronDown
} from "lucide-react"
import { Typography } from "@/components/ui/typography"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import * as React from "react"

interface DashboardSidebarProps {
    isOpen: boolean
}

const sidebarItems = [
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
    {
        icon: Upload,
        label: "Upload",
        href: "/dashboard/upload",
        subItems: [
            // Placeholder for expandable items if needed based on the "caret" in the design reference
        ]
    },
    { icon: RefreshCw, label: "Reconciliation", href: "/dashboard/reconciliation" },
    { icon: FileText, label: "Reports", href: "/dashboard/reports" },
    { icon: BarChart3, label: "MIS", href: "/dashboard/mis" },
    { icon: History, label: "Audit Trail", href: "/dashboard/audit-trail" },
]

export function DashboardSidebar({ isOpen }: DashboardSidebarProps) {
    const pathname = usePathname()
    const [isUploadOpen, setIsUploadOpen] = React.useState(false)

    return (
        <aside
            className={cn(
                "fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-64 border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out pb-4 flex flex-col justify-between",
                !isOpen && "-translate-x-full"
            )}
        >
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="grid gap-1 px-4">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href

                        if (item.label === "Upload") {
                            // Special handling for Upload to mimic the dropdown/expandable nature if implied by design
                            // For now, keeping it simple as a link unless user specifically asked for submenus.
                            // The reference image shows a chevron on Upload.
                            return (
                                <Collapsible
                                    key={index}
                                    open={isUploadOpen}
                                    onOpenChange={setIsUploadOpen}
                                    className="w-full"
                                >
                                    <CollapsibleTrigger asChild>
                                        <button
                                            className={cn(
                                                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900",
                                                isActive && "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-5 w-5" />
                                                <Typography variant="body-md" className="font-medium">
                                                    {item.label}
                                                </Typography>
                                            </div>
                                            <ChevronDown className={cn("h-4 w-4 transition-transform", isUploadOpen && "rotate-180")} />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-4 py-2">
                                        {/* Placeholder sub-items */}
                                        <div className="rounded-md bg-gray-50 p-2 text-sm text-gray-500">
                                            Sub-items would go here
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            )
                        }

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900",
                                    isActive && "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <Typography variant="body-md" className="font-medium">
                                    {item.label}
                                </Typography>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="px-4 py-4 border-t border-gray-100">
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900",
                        pathname === "/dashboard/settings" && "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                    )}
                >
                    <Settings className="h-5 w-5" />
                    <Typography variant="body-md" className="font-medium">
                        Settings
                    </Typography>
                </Link>
            </div>
        </aside>
    )
}
