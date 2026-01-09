import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/metric-card"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { MatchAnalysisChart } from "@/components/charts/match-analysis-chart"
import { ProcessEfficiencyChart } from "@/components/charts/process-efficiency-chart"
import { ReconciliationTrendChart } from "@/components/charts/reconciliation-trend-chart"
import { UploadVolumeChart } from "@/components/charts/upload-volume-chart"
import { ReconciliationSummary } from "@/components/reconciliation-summary"
import { PendingReview } from "@/components/pending-review"
import { Plus, Upload, RefreshCw, FileText, Eye, Sparkles, Briefcase, ShieldCheck, AlertCircle, BarChart3, History, Search } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            <div className="flex-1 space-y-8">
                {/* Action Buttons Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer shadow-sm">
                            <Plus className="h-4 w-4" />
                            New Task
                        </Button>
                        <Button variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 gap-2 cursor-pointer shadow-sm">
                            <Upload className="h-4 w-4" />
                            Upload File
                        </Button>
                        <Button variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 gap-2 cursor-pointer shadow-sm">
                            <RefreshCw className="h-4 w-4" />
                            Run Reconciliation
                        </Button>
                        <Button variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 gap-2 cursor-pointer shadow-sm">
                            <FileText className="h-4 w-4" />
                            Generate Report
                        </Button>
                        <Button variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 gap-2 cursor-pointer shadow-sm">
                            <Eye className="h-4 w-4" />
                            View BRS
                        </Button>
                    </div>

                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 text-sm font-medium cursor-pointer hover:bg-indigo-100 transition-colors">
                        <Sparkles className="h-4 w-4" />
                        AI Insights Available
                    </div>
                </div>

                {/* Stats Cards Section */}
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x w-full max-w-[85vw] md:max-w-full">
                    <div className="snap-start flex-shrink-0">
                        <MetricCard
                            title="Total Transactions"
                            value="1,245,098"
                            subValue="TOTAL TRANSACTIONS"
                            trend={12.5}
                            icon={Briefcase}
                        />
                    </div>
                    <div className="snap-start flex-shrink-0">
                        <MetricCard
                            title="Matched Transactions"
                            value="1,210,045"
                            subValue="MATCHED TRANSACTIONS"
                            trend={98.2}
                            icon={ShieldCheck}
                        />
                    </div>
                    <div className="snap-start flex-shrink-0">
                        <MetricCard
                            title="Unmatched"
                            value="35,053"
                            subValue="UNMATCHED"
                            trend={-2.4}
                            icon={AlertCircle}
                        />
                    </div>
                    <div className="snap-start flex-shrink-0">
                        <MetricCard
                            title="Match Percentage"
                            value="97.1%"
                            subValue="MATCH PERCENTAGE"
                            trend={0.5}
                            icon={BarChart3}
                        />
                    </div>
                    <div className="snap-start flex-shrink-0">
                        <MetricCard
                            title="Manual Effort Saved"
                            value="450 hrs"
                            subValue="SAVED"
                            trend={15}
                            icon={History}
                        />
                    </div>
                    <div className="snap-start flex-shrink-0">
                        <MetricCard
                            title="Revenue Leakage"
                            value="$12,400"
                            subValue="REVENUE LEAKAGE"
                            trend={-5.2}
                            icon={Search}
                        />
                    </div>
                </div>

                {/* Charts Section */}
                <div className="space-y-6">
                    {/* Top Row: Donut Charts (50%) and Line Chart (50%) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <MatchAnalysisChart />
                            <ProcessEfficiencyChart />
                        </div>
                        <ReconciliationTrendChart />
                    </div>

                    {/* Bottom Row: Full Width Bar Chart */}
                    <div className="grid grid-cols-1">
                        <UploadVolumeChart />
                    </div>

                    {/* Tables Section */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ReconciliationSummary />
                        <PendingReview />
                    </div>
                </div>
            </div>
        </div>
    )
}
