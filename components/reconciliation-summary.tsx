import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, Copy, FileWarning } from "lucide-react"

const items = [
    {
        id: "RE-202300",
        title: "Txn #99281 - Amount Mismatch",
        type: "Mismatch",
        icon: AlertCircle,
    },
    {
        id: "RE-202300",
        title: "Txn #99281 - Amount Mismatch",
        type: "Data Gap",
        icon: FileWarning,
    },
    {
        id: "RE-202300",
        title: "Txn #99281 - Amount Mismatch",
        type: "Duplicate",
        icon: Copy,
    },
    {
        id: "RE-202300",
        title: "Txn #99281 - Amount Mismatch",
        type: "Timing",
        icon: Clock,
    },
]

export function ReconciliationSummary() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100">
                <CardTitle className="text-base font-bold text-gray-900">
                    Reconciliation Summary
                </CardTitle>
                <Button variant="link" className="text-blue-600 font-semibold px-0 h-auto">
                    View All
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <div className="flex flex-col">
                    {/* Header Row */}
                    <div className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex-1 pl-1">ITEM NAME</div>
                        <div className="w-32 text-center">ISSUE TYPE</div>
                        <div className="w-20 text-right pr-1">ACTION</div>
                    </div>
                    {/* List Items */}
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center px-6 py-4 border-b border-dashed border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-gray-900 truncate">
                                    {item.title}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    ID: {item.id}
                                </div>
                            </div>
                            <div className="w-32 flex justify-center">
                                <Button variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-xs font-medium text-gray-600 w-full justify-center">
                                    <item.icon className="w-3.5 h-3.5 text-gray-400" />
                                    {item.type}
                                </Button>
                            </div>
                            <div className="w-20 flex justify-end">
                                <Button
                                    variant="ghost"
                                    className="text-blue-500 hover:text-blue-600 font-semibold h-auto p-0 text-sm hover:bg-transparent"
                                >
                                    Resolve
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
