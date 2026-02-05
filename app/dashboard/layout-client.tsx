"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

const DashboardNavbar = dynamic(
  () =>
    import("@/components/dashboard-navbar").then(
      (mod) => mod.DashboardNavbar
    ),
  { ssr: false }
)

const DashboardSidebar = dynamic(
  () =>
    import("@/components/dashboard-sidebar").then(
      (mod) => mod.DashboardSidebar
    ),
  { ssr: false }
)

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  function toggleSidebar() {
    setIsSidebarOpen(prev => !prev)
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
