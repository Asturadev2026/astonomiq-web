"use client"

import { useEffect, useState } from "react"
import { Typography } from "@/components/ui/typography"

export default function MISPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/mis")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Typography>Loading MIS data…</Typography>
  }

  return (
    <div className="space-y-6">
      <Typography variant="h1" className="font-semibold text-gray-900">
        MIS
      </Typography>

      <div className="rounded-lg border bg-white p-6 overflow-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr>
              {Object.keys(data[0] || {}).map(col => (
                <th key={col} className="border px-2 py-1 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val: any, j) => (
                  <td key={j} className="border px-2 py-1">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
