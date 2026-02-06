"use client"

import { useEffect, useMemo, useState } from "react"
import { Typography } from "@/components/ui/typography"

type Row = Record<string, any>

/* ---------------------------------------------
   SAFE NORMALIZER
--------------------------------------------- */
function normalizeMISResponse(input: unknown): Row[] {
  if (Array.isArray(input)) return input

  if (typeof input === "object" && input !== null) {
    const maybeRows = (input as { rows?: unknown }).rows

    if (Array.isArray(maybeRows)) return maybeRows
    if (typeof maybeRows === "string") {
      try {
        const parsed = JSON.parse(maybeRows)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
  }

  return []
}

export default function ReportsPage() {
  const [data, setData] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    fetch("https://asturaintelligence.app.n8n.cloud/webhook/mis-data")
      .then(res => res.json())
      .then(json => setData(normalizeMISResponse(json)))
      .finally(() => setLoading(false))
  }, [])

  /* ---------------- HELPERS ---------------- */

  const sum = (rows: Row[], key: string) =>
    rows.reduce((a, b) => a + Number(b[key] || 0), 0)

  const groupBy = (arr: Row[], key: string) =>
    arr.reduce<Record<string, Row[]>>((acc, row) => {
      const k = String(row[key] ?? "UNKNOWN")
      acc[k] = acc[k] || []
      acc[k].push(row)
      return acc
    }, {})

  /* =====================================================
     ALL useMemo HOOKS — ALWAYS EXECUTED
  ===================================================== */

  const dailyReport = useMemo(() => {
    const byDate = groupBy(data, "HIS_Date")
    return Object.entries(byDate).map(([date, rows]) => ({
      date,
      his: sum(rows, "HIS_Amount"),
      paytm: sum(rows, "PAYTM_Amount"),
      cash: sum(
        rows.filter(r => r.HIS_PaymentMode === "Cash"),
        "HIS_Amount"
      ),
      bank: sum(rows, "BNK_Amount"),
      difference: sum(rows, "HIS_Amount") - sum(rows, "BNK_Amount"),
    }))
  }, [data])

  const exceptionRows = useMemo(
    () =>
      data.filter(
        r =>
          r.BNK_Amount === null ||
          r.BNK_Amount === undefined ||
          r.ScenarioCode !== "FULL_MATCH"
      ),
    [data]
  )

  const mdrReport = useMemo(() => {
    const digital = data.filter(r => r.HIS_PaymentMode !== "Cash")
    return {
      gross: sum(digital, "PAYTM_Amount"),
      mdr: sum(digital, "PAYTM_mdrAmount"),
      gst: sum(digital, "PAYTM_gstAmount"),
      net: sum(digital, "PAYTM_NetAmount"),
    }
  }, [data])

  const modeSummary = useMemo(() => {
    const byMode = groupBy(data, "HIS_PaymentMode")
    return Object.entries(byMode).map(([mode, rows]) => ({
      mode,
      amount: sum(rows, "HIS_Amount"),
    }))
  }, [data])

  const mismatchRows = useMemo(
    () =>
      data.filter(
        r =>
          (!r.PAYTM_Amount && r.HIS_Amount) ||
          (r.PAYTM_Amount && !r.HIS_Amount)
      ),
    [data]
  )

  const agingReport = useMemo(() => {
    const buckets: Record<string, number> = {
      "T+0": 0,
      "T+1": 0,
      "T+2": 0,
      "T+3+": 0,
    }

    data.forEach(r => {
      if (r.BNK_Amount) return

      const days = Number(r.Days_To_Bank || 0)
      const amt = Number(r.HIS_Amount || 0)

      if (days === 0) buckets["T+0"] += amt
      else if (days === 1) buckets["T+1"] += amt
      else if (days === 2) buckets["T+2"] += amt
      else buckets["T+3+"] += amt
    })

    return buckets
  }, [data])

  /* =====================================================
     SAFE CONDITIONAL RENDER (AFTER HOOKS)
  ===================================================== */

  if (loading) {
    return <Typography>Loading reports…</Typography>
  }

  /* ---------------- PAGE ---------------- */

  return (
    <div className="space-y-10">
      <Typography variant="h1" className="font-semibold text-gray-900">
        Reports
      </Typography>

      <Section title="Daily Collection vs Settlement">
        <SimpleTable
          headers={["Date", "HIS Billed", "Paytm", "Cash", "Bank", "Difference"]}
          rows={dailyReport.map(r => [
            r.date,
            r.his,
            r.paytm,
            r.cash,
            r.bank,
            r.difference,
          ])}
        />
      </Section>

      <Section title="Unsettled / Exception Report">
        <SimpleTable
          headers={["Transaction", "Mode", "HIS", "Bank", "Status"]}
          rows={exceptionRows.map(r => [
            r.TransactionID,
            r.HIS_PaymentMode,
            r.HIS_Amount,
            r.BNK_Amount ?? "Pending",
            r.ScenarioCode,
          ])}
        />
      </Section>

      <Section title="MDR & GST Impact">
        <SimpleTable
          headers={["Gross", "MDR", "GST", "Net Received"]}
          rows={[
            [mdrReport.gross, mdrReport.mdr, mdrReport.gst, mdrReport.net],
          ]}
        />
      </Section>

      <Section title="Mode-wise Collection Summary">
        <SimpleTable
          headers={["Mode", "Collected Amount"]}
          rows={modeSummary.map(r => [r.mode, r.amount])}
        />
      </Section>

      <Section title="HIS vs Payment Gateway Mismatch">
        <SimpleTable
          headers={["Transaction", "HIS Amount", "Paytm Amount"]}
          rows={mismatchRows.map(r => [
            r.TransactionID,
            r.HIS_Amount ?? "Missing",
            r.PAYTM_Amount ?? "Missing",
          ])}
        />
      </Section>

      <Section title="Aging Settlement Report">
        <SimpleTable
          headers={["Bucket", "Pending Amount"]}
          rows={Object.entries(agingReport)}
        />
      </Section>
    </div>
  )
}

/* ---------------- UI HELPERS ---------------- */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm space-y-3">
      <Typography className="font-medium text-gray-900">{title}</Typography>
      {children}
    </div>
  )
}

function SimpleTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: any[][]
}) {
  return (
    <table className="min-w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          {headers.map(h => (
            <th key={h} className="border px-3 py-2 text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
            {r.map((c, j) => (
              <td key={j} className="border px-3 py-2">
                {typeof c === "number" ? `₹ ${c.toLocaleString()}` : c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
