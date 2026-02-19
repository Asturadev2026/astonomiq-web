"use client";

import { useEffect, useMemo, useState } from "react";
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

/* ================== TYPES ================== */

type Row = Record<string, any>;

/* ================== DATE HELPERS ================== */

function parseDate(d: unknown): number {
  if (!d) return 0;

  if (typeof d === "number") {
    return new Date((d - 25569) * 86400 * 1000).getTime();
  }

  if (typeof d === "string") {
    const ts = Date.parse(d);
    return isNaN(ts) ? 0 : ts;
  }

  return 0;
}

function pctChange(curr: number, prev: number) {
  if (!prev) return 0;
  return Number((((curr - prev) / prev) * 100).toFixed(1));
}

/* ================== METRICS ================== */

function computeMetrics(data: Row[]) {
  if (!data.length) return null;

  const total = data.length;

  const matched = data.filter(
    r => r.scenario_code === "FULL_MATCH"
  ).length;

  const unmatched = total - matched;

  const matchPct = total
    ? Number(((matched / total) * 100).toFixed(1))
    : 0;

  const leakage = data.reduce((sum, r) => {
    if (r.scenario_code === "FULL_MATCH") return sum;

    const diff =
      Number(r.his_amount || 0) -
      Number(r.bnk_amount || 0);

    return diff > 0 ? sum + diff : sum;
  }, 0);

  /* ===== GROUP BY DATE ===== */

  const byDate = data.reduce<Record<number, Row[]>>((acc, r) => {
    const ts = parseDate(r.his_date);
    if (!ts) return acc;

    acc[ts] = acc[ts] || [];
    acc[ts].push(r);

    return acc;
  }, {});

  const dates = Object.keys(byDate)
    .map(Number)
    .sort((a, b) => a - b);

  if (dates.length < 2) {
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
      effortTrend: 15,
      leakage: Math.round(leakage),
      leakageTrend: 0,
    };
  }

  const latest = byDate[dates[dates.length - 1]] || [];
  const previous = byDate[dates[dates.length - 2]] || [];

  const latestMatched = latest.filter(
    r => r.scenario_code === "FULL_MATCH"
  ).length;

  const previousMatched = previous.filter(
    r => r.scenario_code === "FULL_MATCH"
  ).length;

  const latestLeakage = latest.reduce((s, r) => {
    if (r.scenario_code === "FULL_MATCH") return s;

    const d =
      Number(r.his_amount || 0) -
      Number(r.bnk_amount || 0);

    return d > 0 ? s + d : s;
  }, 0);

  const previousLeakage = previous.reduce((s, r) => {
    if (r.scenario_code === "FULL_MATCH") return s;

    const d =
      Number(r.his_amount || 0) -
      Number(r.bnk_amount || 0);

    return d > 0 ? s + d : s;
  }, 0);

  return {
    total,
    matched,
    unmatched,
    matchPct,

    totalTrend: pctChange(latest.length, previous.length),
    matchedTrend: pctChange(latestMatched, previousMatched),
    unmatchedTrend: pctChange(
      latest.length - latestMatched,
      previous.length - previousMatched
    ),
    matchPctTrend: pctChange(
      latest.length
        ? (latestMatched / latest.length) * 100
        : 0,
      previous.length
        ? (previousMatched / previous.length) * 100
        : 0
    ),

    effortHours: Math.round(matched * 0.00037),
    effortTrend: 15,

    leakage: Math.round(leakage),
    leakageTrend: pctChange(latestLeakage, previousLeakage),
  };
}

/* ================== PAGE ================== */

export default function DashboardPage() {
  const [showReconDialog, setShowReconDialog] = useState(false);
  const [data, setData] = useState<Row[]>([]);

  useEffect(() => {
    fetch("https://asturaintelligence.app.n8n.cloud/webhook/mis-data")
      .then(res => res.json())
      .then(res => {
        const rows =
          typeof res?.rows === "string"
            ? JSON.parse(res.rows)
            : Array.isArray(res?.rows)
            ? res.rows
            : Array.isArray(res)
            ? res
            : [];

        setData(rows);
      });
  }, []);

  const metrics = useMemo(() => computeMetrics(data), [data]);

  const handleGenerateReport = async () => {
    const res = await fetch("https://asturaintelligence.app.n8n.cloud/webhook/mis-data");
    const json = await res.json();

    const rows =
      typeof json?.rows === "string"
        ? JSON.parse(json.rows)
        : Array.isArray(json?.rows)
        ? json.rows
        : Array.isArray(json)
        ? json
        : [];

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
    a.download = `MIS_Report_${new Date().toISOString().slice(0, 10)}.csv`;
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
        {metrics && (
          <div className="flex overflow-x-auto gap-4 pb-4">
            <MetricCard title="Total Transactions" value={metrics.total.toLocaleString()} subValue="TOTAL TRANSACTIONS" trend={metrics.totalTrend} icon={Briefcase} />
            <MetricCard title="Matched Transactions" value={metrics.matched.toLocaleString()} subValue="MATCHED" trend={metrics.matchedTrend} icon={ShieldCheck} />
            <MetricCard title="Unmatched" value={metrics.unmatched.toLocaleString()} subValue="DISCREPANCIES" trend={metrics.unmatchedTrend} icon={AlertCircle} />
            <MetricCard title="Match Percentage" value={`${metrics.matchPct}%`} subValue="ACCURACY" trend={metrics.matchPctTrend} icon={BarChart3} />
            <MetricCard title="Manual Effort Saved" value={`${metrics.effortHours} hrs`} subValue="TIME SAVED" trend={metrics.effortTrend} icon={History} />
            <MetricCard title="Revenue Leakage" value={`₹ ${metrics.leakage.toLocaleString()}`} subValue="AT RISK" trend={metrics.leakageTrend} icon={Search} />
          </div>
        )}

        {/* CHARTS (UNCHANGED) */}
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

      {/* DIALOG */}
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
