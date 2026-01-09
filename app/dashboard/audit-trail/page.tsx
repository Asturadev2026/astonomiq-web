import { Typography } from "@/components/ui/typography"

export default function Page() {
    return (
        <div className="space-y-6">
            <Typography variant="h1" className="font-semibold text-gray-900">
                Audit Trail
            </Typography>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <Typography variant="body-md" className="text-gray-500">
                    Content for Audit Trail goes here.
                </Typography>
            </div>
        </div>
    )
}
