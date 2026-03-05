"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const API_URL = "/api/mis";

type ReconciliationItem = {
  transaction_id: string
  order_id: string
  paytm_source: string
  bnk_source: string
  scenario_code: string
  result: string
  justification: string
  created_at: string
}

export function ReconciliationSummary() {
  const [items, setItems] = useState<ReconciliationItem[]>([])
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(4)

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(API_URL)
      const response = await res.json()

      // ✅ Ensure data is always an array
      const data = Array.isArray(response) ? response : []

      // 🔥 MAP DB FORMAT → UI FORMAT
      const mappedData: ReconciliationItem[] = data.map((row: any) => ({
        transaction_id: row["HIS Transaction ID"],
        order_id: row["BILL Number"],
        paytm_source: row["PAYTM Transaction ID"],
        bnk_source: row["Net Amount Credited"],
        scenario_code: row["ScenarioCode"],
        result: row["Result"],
        justification: row["Justification"],
        created_at: row["created_at"]
      }))

      // 🔥 FRONTEND FILTER
      const filteredData = mappedData.filter(
        (item: ReconciliationItem) => item.result !== "Reconciled"
      )

      setItems(filteredData)
    } catch (err) {
      console.error(err)
      setItems([])
    }
  }

  fetchData()
}, [])

  const toggleRow = (transactionId: string) => {
    setExpandedRow(prev =>
      prev === transactionId ? null : transactionId
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
        <CardTitle className="text-base font-bold text-gray-900">
          Reconciliation Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div className="flex flex-col">

          {/* Header */}
          <div className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 border-b bg-gray-50">
            <div className="flex-1">TRANSACTION</div>
            <div className="w-40 text-center">SCENARIO</div>
            <div className="w-20 text-right">ACTION</div>
          </div>

          {items.slice(0, visibleCount).map((item, index) => (
            <div key={index}>
              
              {/* Main Row */}
              <div className="flex items-center px-6 py-4 border-b hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900">
                    {item.transaction_id}
                  </div>
                  <div className="text-xs text-gray-400">
                    Order ID: {item.order_id}
                  </div>
                </div>

                <div className="w-40 flex justify-center">
                  <Button
                    variant="outline"
                    className="text-xs"
                    onClick={() => toggleRow(item.transaction_id)}
                  >
                    {item.scenario_code}
                  </Button>
                </div>

                <div className="w-20 flex justify-end">
                  <Button
                    variant="ghost"
                    className="text-blue-500 font-semibold text-sm"
                  >
                    Resolve
                  </Button>
                </div>
              </div>

              {/* Expanded Row */}
              {expandedRow === item.transaction_id && (
  <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-3">

      <div>
        <p className="text-gray-400 uppercase tracking-wide">Transaction</p>
        <p className="font-semibold text-gray-900">{item.transaction_id}</p>
      </div>

      <div>
        <p className="text-gray-400 uppercase tracking-wide">Paytm</p>
        <p className="font-medium text-gray-800">
          {item.paytm_source || "—"}
        </p>
      </div>

      <div>
        <p className="text-gray-400 uppercase tracking-wide">Bank</p>
        <p className="font-medium text-gray-800">
          {item.bnk_source || "—"}
        </p>
      </div>

      <div>
        <p className="text-gray-400 uppercase tracking-wide">Created</p>
        <p className="font-medium text-gray-800">
          {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}
        </p>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-3 mb-3">

      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
        {item.scenario_code}
      </span>

      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${
          item.result === "Discrepancy"
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {item.result}
      </span>
    </div>

    <div className="bg-white rounded-md p-3 text-xs text-gray-700 leading-relaxed border">
      <span className="font-semibold text-gray-500 mr-1">
        Justification:
      </span>
      {item.justification}
    </div>

  </div>
)}

            </div>
          ))}

        </div>

        {visibleCount < items.length && (
          <div className="flex justify-end p-4">
            <Button
              variant="outline"
              onClick={() => setVisibleCount(prev => prev + 4)}
            >
              Show More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}