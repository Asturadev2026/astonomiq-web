"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  LogOut,
  User,
  Settings,
  LifeBuoy,
  Menu,
  Search,
  Bell,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react"
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
  const [open, setOpen] = React.useState(false)

  const [profile, setProfile] = React.useState<{
    email: string
    hospital_id: string
  } | null>(null)

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/user", {
          cache: "no-store",
        })
        const data = await res.json()

        if (!data.error) {
          setProfile(data)
        }
      } catch (err) {
        console.error("Profile fetch error:", err)
      }
    }

    fetchProfile()
  }, [])

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

  const handleDateConfirm = async () => {
    let url = "/api/mis"

    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      console.log("Fetching for:", formattedDate)
      url = `/api/mis?date=${formattedDate}`
    } else {
      console.log("No date selected → Fetching ALL data")
    }

    try {
      const res = await fetch(url, {
        cache: "no-store",
      })

      const json = await res.json()
      console.log("API Response:", json)

      window.dispatchEvent(
        new CustomEvent("dashboard-date-data", {
          detail: json,
        })
      )

      setOpen(false)
    } catch (err) {
      console.error("API error:", err)
      setOpen(false)
    }
  }

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
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

      <div className="hidden md:flex flex-1 max-w-xl mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions, files..."
            className="pl-10 h-10 w-full bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* DATE SELECTOR */}
        <div className="hidden md:flex items-center border border-gray-200 rounded-lg p-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 justify-start text-left font-normal px-3"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-700">
                  {date ? format(date, "dd-MM-yyyy") : "Pick a date"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-3" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />

              <div className="mt-3 flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDate(undefined)}
                >
                  Clear
                </Button>

                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleDateConfirm}
                >
                  OK
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* PROFILE DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
  {profile?.email?.[0]?.toUpperCase() || "U"}
</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-72 p-0 overflow-hidden rounded-xl shadow-xl border"
          >
            {profile && (
              <>
                {/* Profile Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {profile.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {profile.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Account
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                      Hospital ID
                    </p>
                    <div className="bg-white border rounded-md px-3 py-1.5 text-xs font-mono text-gray-700 break-all">
                      {profile.hospital_id}
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator />
              </>
            )}

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 font-medium py-3 px-4 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}