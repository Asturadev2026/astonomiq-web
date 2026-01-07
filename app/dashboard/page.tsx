import { Typography } from "@/components/ui/typography"
import { DashboardNavbar } from "@/components/dashboard-navbar"

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNavbar />
            <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="text-center">
                    <Typography variant="h1" className="mb-4">
                        Welcome to the Dashboard
                    </Typography>
                    <Typography variant="body-lg" className="text-gray-600">
                        You have successfully logged in. This is a placeholder for the dashboard content.
                    </Typography>
                </div>
            </main>
        </div>
    )
}
