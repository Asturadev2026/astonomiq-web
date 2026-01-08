import { Typography } from "@/components/ui/typography"

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <Typography variant="h1" className="mb-4">
                Welcome to the Dashboard
            </Typography>
            <Typography variant="body-lg" className="text-gray-600">
                You have successfully logged in. This is a placeholder for the dashboard content.
            </Typography>
        </div>
    )
}
