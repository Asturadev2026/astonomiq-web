import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
    title: string
    value: string
    subValue: string
    trend: number
    icon: LucideIcon
}

export function MetricCard({ title, value, subValue, trend, icon: Icon }: MetricCardProps) {
    const isPositive = trend >= 0
    const TrendIcon = isPositive ? TrendingUp : TrendingDown

    return (
        <Card className="shadow-sm border-gray-100 p-4 min-w-[240px]">
            <CardContent className="p-0 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}>
                        <TrendIcon className="h-3 w-3" />
                        <span>{isPositive ? '+' : ''}{trend}%</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <Typography variant="body-lg" as="h2" className="text-2xl font-bold tracking-tight text-gray-900">
                        {value}
                    </Typography>
                    <div className="space-y-0.5">
                        <Typography variant="label-sm" as="p" className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                            {title}
                        </Typography>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                            {subValue}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
