"use client"

import { useEffect, useState } from "react"
import { Typography } from "@/components/ui/typography"

type MISRow = Record<string, any>

export default function MISPage() {
  const [data, setData] = useState<MISRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("https://asturaintelligence.app.n8n.cloud/webhook/mis-data")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch MIS data")
        return res.json()
      })
      .then(res => {
        let rows: MISRow[] = []

        // ✅ Your current real case: rows is a STRING
        if (typeof res?.rows === "string") {
          rows = JSON.parse(res.rows)
        }
        // fallback: rows already array
        else if (Array.isArray(res?.rows)) {
          rows = res.rows
        }
        // fallback: API returned array directly
        else if (Array.isArray(res)) {
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

  if (loading) {
    return <Typography>Loading MIS data…</Typography>
  }

  if (error) {
    return <Typography className="text-red-600">{error}</Typography>
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <Typography>No MIS data available</Typography>
  }

  const columns = Object.keys(data[0])

  const formatValue = (val: any) => {
    if (typeof val === "number") {
      // Excel date detection
      if (val > 40000 && val < 50000) {
        const date = new Date(Math.round((val - 25569) * 86400 * 1000))
        return date.toLocaleDateString()
      }
      return val.toLocaleString()
    }
    return String(val ?? "")
  }

  return (
  <div className="space-y-6 h-full flex flex-col">
    <Typography variant="h1" className="font-semibold text-gray-900">
      MIS Report
    </Typography>

    {/* ⬇️ Scroll container */}
    <div className="flex-1 border rounded-xl bg-white shadow-sm">
      <div
        className="
          h-[70vh]
          overflow-x-scroll
          overflow-y-scroll
          scrollbar-thin
          scrollbar-thumb-gray-400
          scrollbar-track-gray-100
        "
      >
        <table className="min-w-max border-collapse text-sm">
          <thead className="sticky top-0 bg-gray-100 z-20">
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  className="
                    border
                    px-3
                    py-2
                    text-left
                    font-semibold
                    text-gray-700
                    whitespace-nowrap
                  "
                >
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
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
