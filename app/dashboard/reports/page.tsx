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
    fetch("/api/mis")
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

  const parseDate = (v: any) => {
    if (!v) return null
    if (!isNaN(Number(v))) {
      return new Date((Number(v) - 25569) * 86400 * 1000)
    }
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
  }

  /* =====================================================
     REPORT CALCULATIONS (UPDATED COLUMN NAMES)
  ===================================================== */

  /* -------- DAILY COLLECTION VS SETTLEMENT (UPDATED) -------- */

  const dailyReport = useMemo(() => {

  const rowsWithDate = data.filter(r => r["Settlement Date"])

  const byDate = rowsWithDate.reduce<Record<string, Row[]>>((acc, r) => {

    const d = parseDate(r["Settlement Date"])
    if (!d) return acc

    const key = d.toISOString().split("T")[0]

    acc[key] = acc[key] || []
    acc[key].push(r)

    return acc

  }, {})

  return Object.entries(byDate).map(([date, rows]) => {

    const cashAmount = sum(
      data.filter(r => {
        const mode = String(r["Payment Mode"] || "").toLowerCase()
        const billDate = parseDate(r["BILL Date"])
        if (!billDate) return false

        const billKey = billDate.toISOString().split("T")[0]

        return mode === "cash" && billKey === date
      }),
      "HIS Gross Amount"
    )

    return {
      date,

      his: sum(rows, "HIS Gross Amount"),

      paytm: sum(rows, "PAYTM Amount"),

      cash: cashAmount,

      bank: sum(rows, "Net Amount Credited"),

      difference:
        sum(rows, "HIS Gross Amount") -
        sum(rows, "Net Amount Credited"),
    }

  })

}, [data])

  const exceptionRows = useMemo(
    () =>
      data.filter(
        r =>
          r["Net Amount Credited"] === null ||
          r["Net Amount Credited"] === undefined ||
          r["ScenarioCode"] !== "FULL_MATCH"
      ),
    [data]
  )

  const mdrReport = useMemo(() => {
    const digital = data.filter(
      r => r["Payment Mode"] !== "Cash"
    )

    return {
      gross: sum(digital, "PAYTM Amount"),
      mdr: sum(digital, "MDR Amount"),
      gst: sum(digital, "GST Amount"),
      net: sum(digital, "PAYTM Net Amount"),
    }
  }, [data])

  const modeSummary = useMemo(() => {
    const byMode = groupBy(data, "Payment Mode")

    return Object.entries(byMode).map(([mode, rows]) => ({
      mode,
      amount: sum(rows, "HIS Gross Amount"),
    }))
  }, [data])

  const mismatchRows = useMemo(
    () =>
      data.filter(
        r =>
          (!r["PAYTM Amount"] && r["HIS Gross Amount"]) ||
          (r["PAYTM Amount"] && !r["HIS Gross Amount"])
      ),
    [data]
  )

  /* -------- AGING SETTLEMENT REPORT (UPDATED) -------- */

  const agingReport = useMemo(() => {

    const buckets: Record<string, number> = {
      "T+0": 0,
      "T+1": 0,
      "T+2": 0,
      "T+3+": 0,
    }

    const settlementDates = data
      .map(r => parseDate(r["Settlement Date"]))
      .filter(Boolean) as Date[]

    if (!settlementDates.length) return buckets

    const latestDate = new Date(
      Math.max(...settlementDates.map(d => d.getTime()))
    )

    data.forEach(r => {

      const settleDate = parseDate(r["Settlement Date"])
      if (!settleDate) return

      const diffDays = Math.floor(
        (latestDate.getTime() - settleDate.getTime()) /
        (1000 * 60 * 60 * 24)
      )

      const amt = Number(r["Net Amount Credited"] || 0)

      if (diffDays === 2) buckets["T+0"] += amt
      else if (diffDays === 1) buckets["T+1"] += amt
      else if (diffDays === 0) buckets["T+2"] += amt
      else buckets["T+3+"] += amt

    })

    return buckets

  }, [data])

  /* ---------------- LOADING ---------------- */

  if (loading) return <Typography>Loading reports…</Typography>

  /* ---------------- PAGE ---------------- */

  return (
    <div className="space-y-10">
      <Typography variant="h1" className="font-semibold text-gray-900">
        Reports
      </Typography>

      <Section title="Daily Collection vs Settlement">
        <SimpleTable
          headers={[
            "Date",
            "HIS Billed",
            "Paytm",
            "Cash",
            "Bank",
            "Difference",
          ]}
          rows={dailyReport.map(r => [
            formatDateTime(r.date),
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
          headers={[
            "Transaction",
            "Mode",
            "HIS",
            "Bank",
            "Status",
          ]}
          rows={exceptionRows.map(r => [
            r["HIS Transaction ID"],
            r["Payment Mode"],
            r["HIS Gross Amount"],
            r["Net Amount Credited"] ?? "Pending",
            r["ScenarioCode"],
          ])}
        />
      </Section>

      <Section title="MDR & GST Impact">
        <SimpleTable
          headers={[
            "Gross",
            "MDR",
            "GST",
            "Net Received",
          ]}
          rows={[
            [
              mdrReport.gross,
              mdrReport.mdr,
              mdrReport.gst,
              mdrReport.net,
            ],
          ]}
        />
      </Section>

      <Section title="Mode-wise Collection Summary">
        <SimpleTable
          headers={["Mode", "Collected Amount"]}
          rows={modeSummary.map(r => [
            r.mode,
            r.amount,
          ])}
        />
      </Section>

      <Section title="HIS vs Payment Gateway Mismatch">
        <SimpleTable
          headers={[
            "Transaction",
            "HIS Amount",
            "Paytm Amount",
          ]}
          rows={mismatchRows.map(r => [
            r["HIS Transaction ID"],
            r["HIS Gross Amount"] ?? "Missing",
            r["PAYTM Amount"] ?? "Missing",
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
      <Typography className="font-medium text-gray-900">
        {title}
      </Typography>
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
                {typeof c === "number"
                  ? `₹ ${c.toLocaleString()}`
                  : c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}