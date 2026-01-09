"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { source: "his", visitors: 275, fill: "#1e293b" },
    { source: "bank", visitors: 200, fill: "#1e293b" },
    { source: "upi", visitors: 187, fill: "#1e293b" },
    { source: "cash", visitors: 173, fill: "#1e293b" },
]

const chartConfig = {
    visitors: {
        label: "Volume",
    },
    his: {
        label: "HIS",
        color: "#1e293b",
    },
    bank: {
        label: "Bank",
        color: "#1e293b",
    },
    upi: {
        label: "UPI",
        color: "#1e293b",
    },
    cash: {
        label: "Cash",
        color: "#1e293b",
    },
} satisfies ChartConfig

export function UploadVolumeChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Volume by Source</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[200px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                        <YAxis
                            dataKey="source"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]?.label
                            }
                        />
                        <XAxis dataKey="visitors" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="visitors" layout="vertical" radius={5} barSize={20} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
