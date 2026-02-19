"use client"

import { useEffect, useMemo, useState } from "react"
import { Typography } from "@/components/ui/typography"

type Row = Record<string, any>

export default function ReconciliationPage() {
  const [data, setData] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/mis")
      .then(res => res.json())
      .then(res => {
        const rows =
          typeof res?.rows === "string"
            ? JSON.parse(res.rows)
            : Array.isArray(res?.rows)
            ? res.rows
            : Array.isArray(res)
            ? res
            : []
        setData(rows)
      })
      .finally(() => setLoading(false))
  }, [])

  /* ---------------- SUMMARY METRICS ---------------- */

  const summary = useMemo(() => {
    const total = data.length

    const autoMatched = data.filter(
      d => d.scenario_code === "FULL_MATCH"
    ).length

    const partial = data.filter(d =>
      ["TRIANGLE_DISCREPANCY", "PARTIAL_MATCH"].includes(d.scenario_code)
    ).length

    const unmatched = total - autoMatched - partial

    const valueAtRisk = data
      .filter(d => d.scenario_code !== "FULL_MATCH")
      .reduce((sum, d) => {
        const diff =
          Number(d.his_amount || 0) -
          Number(d.bnk_amount || 0)
        return sum + Math.abs(diff)
      }, 0)

    return { total, autoMatched, partial, unmatched, valueAtRisk }
  }, [data])

  if (loading) return <Typography>Loading reconciliation…</Typography>

  /* ---------------- HELPERS ---------------- */

  const formatAmount = (v: any) =>
    typeof v === "number" ? `₹ ${v.toLocaleString()}` : "-"

  const statusBadge = (code: string) => {
    if (code === "FULL_MATCH")
      return "bg-green-100 text-green-700"
    if (code === "TRIANGLE_DISCREPANCY")
      return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-700"
  }

  const formatDateTime = (v: any) => {
    if (!v) return "-"

    if (!isNaN(Number(v))) {
      const date = new Date((Number(v) - 25569) * 86400 * 1000)
      return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    }

    return v
  }

  /* ---------------- PAGE ---------------- */

  return (
    <div className="space-y-8">
      <Typography variant="h1" className="font-semibold text-gray-900">
        Reconciliation
      </Typography>

      {/* Dashboard */}
      <div className="grid grid-cols-5 gap-4">
        {[
          ["Total Transactions", summary.total],
          ["Auto-Matched", summary.autoMatched],
          ["Partially Matched", summary.partial],
          ["Unmatched", summary.unmatched],
          ["Value at Risk", `₹ ${summary.valueAtRisk.toLocaleString()}`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-xl font-semibold text-gray-900">{value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="overflow-auto max-h-[65vh]">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">HIS Bill No</th>
                <th className="px-3 py-2 text-left">Patient ID</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Payment Mode</th>
                <th className="px-3 py-2 text-right">HIS Amount</th>
                <th className="px-3 py-2 text-right">Paytm Net</th>
                <th className="px-3 py-2 text-right">Bank Credit</th>
                <th className="px-3 py-2 text-right">Difference</th>
                <th className="px-3 py-2 text-left">Match Status</th>
                <th className="px-3 py-2 text-left">Match Logic</th>
              </tr>
            </thead>

            <tbody>
              {data.map((r, i) => {
                const diff =
                  Number(r.his_amount || 0) -
                  Number(r.bnk_amount || 0)

                return (
                  <tr
                    key={i}
                    className={i % 2 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-3 py-2">{r.his_clean_id}</td>
                    <td className="px-3 py-2">{r.his_patient_id}</td>
                    <td className="px-3 py-2">
                      {formatDateTime(r.his_date)}
                    </td>
                    <td className="px-3 py-2">{r.his_payment_mode}</td>
                    <td className="px-3 py-2 text-right">
                      {formatAmount(r.his_amount)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatAmount(r.paytm_net_amount)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatAmount(r.bnk_amount)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatAmount(diff)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${statusBadge(
                          r.scenario_code
                        )}`}
                      >
                        {r.scenario_code}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600">
                      {r.justification ||
                        "Matched on Bill No + Amount (±1 day)"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
