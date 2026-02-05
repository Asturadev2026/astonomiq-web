"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/metric-card";
import { MatchAnalysisChart } from "@/components/charts/match-analysis-chart";
import { ProcessEfficiencyChart } from "@/components/charts/process-efficiency-chart";
import { ReconciliationTrendChart } from "@/components/charts/reconciliation-trend-chart";
import { UploadVolumeChart } from "@/components/charts/upload-volume-chart";
import { ReconciliationSummary } from "@/components/reconciliation-summary";
import { PendingReview } from "@/components/pending-review";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UploadDialogContent } from "@/components/upload-dialog-content";

import {
  Plus,
  Upload,
  RefreshCw,
  FileText,
  Eye,
  Sparkles,
  Briefcase,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  History,
  Search,
} from "lucide-react";

export default function DashboardPage() {
  const [showReconDialog, setShowReconDialog] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <div className="flex-1 space-y-8">

        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">

            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              New Task
            </Button>

            {/* Upload dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 gap-2 shadow-sm"
                >
                  <Upload className="h-4 w-4" />
                  Upload File
                </Button>
              </DialogTrigger>

              <UploadDialogContent />
            </Dialog>

            {/* Run Reconciliation */}
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 gap-2 shadow-sm"
              onClick={() => setShowReconDialog(true)}
            >
              <RefreshCw className="h-4 w-4" />
              Run Reconciliation
            </Button>

            <Button
              variant="outline"
              className="bg-white border-gray-200 gap-2 shadow-sm"
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>

            <Button
              variant="outline"
              className="bg-white border-gray-200 gap-2 shadow-sm"
            >
              <Eye className="h-4 w-4" />
              View BRS
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI Insights Available
          </div>
        </div>

        {/* METRICS */}
        <div className="flex overflow-x-auto gap-4 pb-4">
          <MetricCard title="Total Transactions" value="1,245,098" subValue="TOTAL TRANSACTIONS" trend={12.5} icon={Briefcase} />
          <MetricCard title="Matched Transactions" value="1,210,045" subValue="MATCHED" trend={98.2} icon={ShieldCheck} />
          <MetricCard title="Unmatched" value="35,053" subValue="DISCREPANCIES" trend={-2.4} icon={AlertCircle} />
          <MetricCard title="Match Percentage" value="97.1%" subValue="ACCURACY" trend={0.5} icon={BarChart3} />
          <MetricCard title="Manual Effort Saved" value="450 hrs" subValue="TIME SAVED" trend={15} icon={History} />
          <MetricCard title="Revenue Leakage" value="$12,400" subValue="AT RISK" trend={-5.2} icon={Search} />
        </div>

        {/* CHARTS */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <MatchAnalysisChart />
              <ProcessEfficiencyChart />
            </div>
            <ReconciliationTrendChart />
          </div>

          <UploadVolumeChart />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ReconciliationSummary />
            <PendingReview />
          </div>
        </div>
      </div>

      {/* ✅ Reconciliation Status Dialog */}
      <Dialog open={showReconDialog} onOpenChange={setShowReconDialog}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Reconciliation running!
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600 mt-2">
            Your reconciliation process has started.  
            You’ll be notified once it completes.
          </p>

          <DialogFooter className="mt-6 flex justify-center">
            <Button onClick={() => setShowReconDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
