"use client"

import { useEffect, useMemo, useState } from "react"
import { Typography } from "@/components/ui/typography"

type MISRow = Record<string, any>

/* ✅ Column order WITHOUT row_number */
const COLUMN_ORDER = [
  "transaction_id",
  "his_clean_id",
  "paytm_clean_id",
  "bnk_clean_id",
  "order_id",
  "utr",
  "bank_transaction_id",

  "his_amount",
  "paytm_amount",
  "paytm_net_amount",
  "bnk_amount",

  "paytm_mdr_percent",
  "paytm_mdr_amount",
  "paytm_gst_percent",
  "paytm_gst_amount",

  "his_status",
  "paytm_status",
  "bnk_drcr",

  "his_date",
  "paytm_date",
  "bnk_date",
  "days_to_bank",

  "his_department",
  "his_payment_mode",
  "his_patient_id",

  "paytm_upi",
  "paytm_patient_id",

  "bnk_narration",

  "his_source",
  "paytm_source",
  "bnk_source",

  "scenario_code",
  "result",
  "justification",
]

export default function MISPage() {
  const [data, setData] = useState<MISRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/mis")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch MIS data")
        return res.json()
      })
      .then(res => {
        let rows: MISRow[] = []

        if (typeof res?.rows === "string") {
          rows = JSON.parse(res.rows)
        } else if (Array.isArray(res?.rows)) {
          rows = res.rows
        } else if (Array.isArray(res)) {
          rows = res
        }

        setData(rows)
      })
      .catch(err => {
        console.error(err)
        setError("Unable to load MIS data")
      })
      .finally(() => setLoading(false))
  }, [])

  /* ✅ SORT DATA BY DATE (Latest First) */
  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => Number(b.his_date || 0) - Number(a.his_date || 0)
    )
  }, [data])

  if (loading) return <Typography>Loading MIS data…</Typography>
  if (error) return <Typography className="text-red-600">{error}</Typography>
  if (!sortedData.length)
    return <Typography>No MIS data available</Typography>

  const columns = COLUMN_ORDER.filter(col => col in sortedData[0])

  /* ✅ UPDATED: No formatting, render exactly as stored */
  const formatValue = (val: any) => {
    if (val === null || val === undefined) return ""
    return String(val)
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Typography variant="h1" className="font-semibold text-gray-900">
        MIS Report
      </Typography>

      <div className="flex-1 border rounded-xl bg-white shadow-sm">
        <div className="h-[70vh] overflow-x-scroll overflow-y-scroll">
          <table className="min-w-max border-collapse text-sm">
            <thead className="sticky top-0 bg-gray-100 z-20">
              <tr>
                {/* ✅ NEW SEQUENTIAL ROW COLUMN */}
                <th className="border px-3 py-2 text-left font-semibold text-gray-700">
                  ROW NO
                </th>

                {columns.map(col => (
                  <th
                    key={col}
                    className="border px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {col.replace(/_/g, " ").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedData.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {/* ✅ UI GENERATED SEQUENCE */}
                  <td className="border px-3 py-2 font-medium">
                    {i + 1}
                  </td>

                  {columns.map(col => (
                    <td
                      key={col}
                      className="border px-3 py-2 whitespace-nowrap"
                    >
                      {formatValue(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}