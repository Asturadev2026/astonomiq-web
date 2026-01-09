import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const reviews = [
    {
        date: "2023-10-24",
        source: "HDFC Bank",
        matched: "14,800",
        unmatched: "200",
        status: "Completed",
        statusColor: "bg-green-50 text-green-600",
    },
    {
        date: "2023-10-24",
        source: "Razorpay UPI",
        matched: "8,500",
        unmatched: "-",
        status: "Verified",
        statusColor: "bg-blue-50 text-blue-600",
    },
    {
        date: "2023-10-24",
        source: "Apollo HIS Report",
        matched: "8,500",
        unmatched: "400",
        status: "Attention",
        statusColor: "bg-red-50 text-red-600",
    },
    {
        date: "2023-10-24",
        source: "HDFC Bank",
        matched: "14,800",
        unmatched: "200",
        status: "Completed",
        statusColor: "bg-green-50 text-green-600",
    },
]

export function PendingReview() {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-gray-900">
                    Pending Review
                </CardTitle>
                <Button variant="link" className="text-blue-600 font-semibold px-0 h-auto">
                    Prioritize
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <div className="w-full">
                    {/* Header Row */}
                    <div className="grid grid-cols-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                        <div className="text-left">DATE</div>
                        <div className="text-left">SOURCE</div>
                        <div className="text-left pl-4">MATCHED</div>
                        <div className="text-center">UNMATCHED</div>
                        <div className="text-right">STATUS</div>
                    </div>
                    {/* Table Rows */}
                    <div className="flex flex-col">
                        {reviews.map((row, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-5 items-center px-6 py-4 hover:bg-gray-50/50 transition-colors border-b border-dashed border-gray-100 last:border-0"
                            >
                                <div className="text-sm font-medium text-gray-700">
                                    {row.date}
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {row.source}
                                </div>
                                <div className="text-sm font-bold text-gray-900 pl-4">
                                    {row.matched}
                                </div>
                                <div className={`text-sm font-bold text-center ${row.unmatched === '-' ? 'text-gray-400' : 'text-red-500'}`}>
                                    {row.unmatched}
                                </div>
                                <div className="flex justify-end">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}>
                                        {row.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
