"use client";

import { useMemo, useState, useEffect } from "react";
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
import AIChatWidget from "@/components/ai-chat-widget";

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

type Row = Record<string, any>;

function pctChange(curr: number, prev: number) {
  if (!prev) return 0;
  return Number((((curr - prev) / prev) * 100).toFixed(1));
}

function computeMetrics(data: Row[]) {
  if (!data || data.length === 0) {
    return {
      total: 0,
      matched: 0,
      unmatched: 0,
      matchPct: 0,
      totalTrend: 0,
      matchedTrend: 0,
      unmatchedTrend: 0,
      matchPctTrend: 0,
      effortHours: 0,
      effortTrend: 0,
      leakage: 0,
      leakageTrend: 0,
    };
  }

  const total = data.length;
  const matched = data.filter(r => r.scenario_code === "FULL_MATCH").length;
  const unmatched = total - matched;
  const matchPct = total ? Number(((matched / total) * 100).toFixed(1)) : 0;

  const leakage = data.reduce((sum, r) => {
    if (r.scenario_code === "FULL_MATCH") return sum;
    const diff = Number(r.his_amount || 0) - Number(r.bnk_amount || 0);
    return diff > 0 ? sum + diff : sum;
  }, 0);

  return {
    total,
    matched,
    unmatched,
    matchPct,
    totalTrend: 0,
    matchedTrend: 0,
    unmatchedTrend: 0,
    matchPctTrend: 0,
    effortHours: Math.round(matched * 0.00037),
    effortTrend: 0,
    leakage: Math.round(leakage),
    leakageTrend: 0,
  };
}

export default function DashboardPage() {
  const [showReconDialog, setShowReconDialog] = useState(false);
  const [data, setData] = useState<Row[]>([]);
  const [selectedDate, setSelectedDate] = useState("");

  /* ================= DEFAULT LOAD (ALL DATA ON REFRESH) ================= */

  useEffect(() => {
    console.log("🔄 Page loaded → Fetching ALL data");

    fetch("/api/mis", { cache: "no-store" })
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json)) {
          console.log("✅ Default data loaded:", json.length);
          setData(json);
        } else {
          console.log("⚠ Default fetch returned non-array");
          setData([]);
        }
      })
      .catch(err => {
        console.error("❌ Default fetch error:", err);
        setData([]);
      });
  }, []);

  /* ================= LISTEN TO NAVBAR DATE EVENT ================= */

  useEffect(() => {
    const handler = (event: any) => {
      console.log("📩 Date event received from navbar:", event.detail);

      if (Array.isArray(event.detail)) {
        console.log("✅ Setting dashboard data:", event.detail.length);
        setData(event.detail);
      } else {
        console.log("⚠ Received non-array response");
        setData([]);
      }
    };

    window.addEventListener("dashboard-date-data", handler);

    return () => {
      window.removeEventListener("dashboard-date-data", handler);
    };
  }, []);

  /* ================= MANUAL FETCH (Optional Backup) ================= */

  const fetchDataByDate = async () => {
    if (!selectedDate) {
      console.log("⚠ No date selected");
      return;
    }

    console.log("🔵 Manual fetch for:", selectedDate);

    try {
      const res = await fetch(`/api/mis?date=${selectedDate}`, {
        cache: "no-store",
      });

      const json = await res.json();

      if (Array.isArray(json)) {
        setData(json);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("❌ API error:", err);
      setData([]);
    }
  };

  const metrics = useMemo(() => computeMetrics(data), [data]);

  const handleGenerateReport = async () => {
    if (!selectedDate) return;

    const res = await fetch(`/api/mis?date=${selectedDate}`, {
      cache: "no-store",
    });

    const json = await res.json();
    const rows = Array.isArray(json) ? json : [];

    downloadCSV(rows);
  };

  function downloadCSV(rows: Row[]) {
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);

    const csv = [
      headers.join(","),
      ...rows.map(row =>
        headers
          .map(h => {
            const val = row[h];
            if (val === null || val === undefined) return "";
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `MIS_Report_${selectedDate || "All_Data"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

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

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white border-gray-200 gap-2 shadow-sm">
                  <Upload className="h-4 w-4" />
                  Upload File
                </Button>
              </DialogTrigger>
              <UploadDialogContent />
            </Dialog>

            <Button
              variant="outline"
              className="bg-white border-gray-200 gap-2 shadow-sm"
              onClick={() => setShowReconDialog(true)}
            >
              <RefreshCw className="h-4 w-4" />
              Run Reconciliation
            </Button>

            <Button
              variant="outline"
              className="bg-white border-gray-200 gap-2 shadow-sm"
              onClick={handleGenerateReport}
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>

            <Button variant="outline" className="bg-white border-gray-200 gap-2 shadow-sm">
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
          <MetricCard title="Total Transactions" value={metrics.total.toLocaleString()} subValue="TOTAL TRANSACTIONS" trend={metrics.totalTrend} icon={Briefcase} />
          <MetricCard title="Matched Transactions" value={metrics.matched.toLocaleString()} subValue="MATCHED" trend={metrics.matchedTrend} icon={ShieldCheck} />
          <MetricCard title="Unmatched" value={metrics.unmatched.toLocaleString()} subValue="DISCREPANCIES" trend={metrics.unmatchedTrend} icon={AlertCircle} />
          <MetricCard title="Match Percentage" value={`${metrics.matchPct}%`} subValue="ACCURACY" trend={metrics.matchPctTrend} icon={BarChart3} />
          <MetricCard title="Manual Effort Saved"   value={`${Math.floor(metrics.total / 20)} hrs`}
 subValue="TIME SAVED" trend={metrics.effortTrend} icon={History} />
          <MetricCard title="Revenue Leakage" value={`₹ ${metrics.leakage.toLocaleString()}`} subValue="AT RISK" trend={metrics.leakageTrend} icon={Search} />
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

      <Dialog open={showReconDialog} onOpenChange={setShowReconDialog}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Reconciliation running!
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-center">
            <Button onClick={() => setShowReconDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AIChatWidget />
    </div>
  );
}