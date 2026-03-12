"use client"

import { useEffect, useState } from "react"
import { Typography } from "@/components/ui/typography"

type AuditLog = {
  id: string
  email: string
  action_type: string
  entity: string
  record_count: number
  description: string
  created_at: string
}

export default function Page() {

  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

  const fetchLogs = async () => {

    try {

      const res = await fetch("/api/audit", {
        cache: "no-store"
      })

      if (!res.ok) {
        console.error("Audit API error:", res.status)
        setLogs([])
        return
      }

      const text = await res.text()

      const data = text ? JSON.parse(text) : []

      if (Array.isArray(data)) {
        setLogs(data)
      } else {
        setLogs([])
      }

    } catch (err) {
      console.error("Audit fetch failed:", err)
      setLogs([])
    } finally {
      setLoading(false)
    }

  }

  fetchLogs()

}, [])

  return (
    <div className="space-y-6">

      <Typography variant="h1" className="font-semibold text-gray-900">
        Audit Trail
      </Typography>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">

        <div className="overflow-auto max-h-[70vh]">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Entity</th>
                <th className="px-4 py-3 text-right">Records</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Time</th>
              </tr>
            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    Loading audit logs...
                  </td>
                </tr>
              )}

              {!loading && logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    No audit logs found
                  </td>
                </tr>
              )}

              {logs.map((log, index) => (

                <tr
                  key={log.id}
                  className={index % 2 ? "bg-gray-50" : "bg-white"}
                >

                  <td className="px-4 py-3 font-medium text-gray-900">
                    {log.email}
                  </td>

                  <td className="px-4 py-3">
                    {log.action_type}
                  </td>

                  <td className="px-4 py-3">
                    {log.entity}
                  </td>

                  <td className="px-4 py-3 text-right font-medium">
                    {log.record_count}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {log.description}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}