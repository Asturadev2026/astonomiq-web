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
  discrepancy_source: string
}

const sourceEmailMap: Record<string, string> = {
  Paytm: "merchant.support@paytm.com",
  Bank: "settlements@bank.com",
  HIS: "his.support@hospital.com"
}

export function ReconciliationSummary() {

  const [items, setItems] = useState<ReconciliationItem[]>([])
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [resolveExpanded, setResolveExpanded] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(4)

  const [emailBody, setEmailBody] = useState<Record<string, string>>({})
  const [editingMail, setEditingMail] = useState<string | null>(null)

  function detectSource(row: any, allRows: any[]) {

  const scenario = row["ScenarioCode"]

  const hisGross = Number(row["HIS Gross Amount"] || 0)
  const hisNet = Number(row["HIS Net Amount"] || 0)
  const discount = Number(row["Discount"] || 0)

  const paytmNet = Number(row["PAYTM Net Amount"] || 0)
  const bankNet = Number(row["Net Amount Credited"] || 0)

  const billNo = row["BILL Number"]

  const rowsSameBill = allRows.filter(r => r["BILL Number"] === billNo)

  const sumNetSameBill = rowsSameBill.reduce(
    (s, r) => s + Number(r["HIS Net Amount"] || 0),
    0
  )

  /* ================= TRIANGLE DISCREPANCY ================= */

  if (scenario === "TRIANGLE_DISCREPANCY") {

    if (bankNet !== paytmNet) {
      return "Bank"
    }

    if (paytmNet !== hisNet) {
      return "Paytm"
    }

    if ((hisNet - discount) !== hisGross) {
      return "HIS"
    }

  }

  /* ================= PARTIAL PAYMENT ================= */

  if (scenario === "PARTIAL_PAYMENT_MISMATCH" || scenario === "PARTIAL_PAYMENT_MATCH") {

    if ((sumNetSameBill - discount) !== hisGross) {
      return "HIS"
    }

    if (bankNet !== paytmNet) {
      return "Bank"
    }

    if (paytmNet !== hisNet) {
      return "Paytm"
    }

  }

  /* ================= SPLIT PAYMENT ================= */

  if (scenario === "SPLIT_PAYMENT_MISMATCH" || scenario === "SPLIT_PAYMENT_MATCH") {

    if ((sumNetSameBill - discount) !== hisGross) {
      return "HIS"
    }

    if (bankNet !== paytmNet) {
      return "Bank"
    }

    if (paytmNet !== hisNet) {
      return "Paytm"
    }

  }

  /* ================= DEFAULT ================= */

  if (!row["PAYTM Transaction ID"]) return "Paytm"
  if (!row["Net Amount Credited"]) return "Bank"

  return "HIS"
}

  function generateEmailBody(item: ReconciliationItem) {

    if (item.discrepancy_source === "Paytm") {
      return `Dear Paytm Team,

We have identified a discrepancy during reconciliation.

Transaction ID: ${item.transaction_id}
Order ID: ${item.order_id}

The transaction exists in our HIS records but has not been confirmed in Paytm settlement records.

Kindly review and confirm the transaction status.

Regards,
Finance Team
AstonomiQ`
    }

    if (item.discrepancy_source === "Bank") {
      return `Dear Bank Team,

We are reviewing a reconciliation discrepancy.

Transaction ID: ${item.transaction_id}
Order ID: ${item.order_id}

The payment appears in Paytm records but the corresponding settlement entry is not visible in bank records.

Kindly verify and confirm the settlement.

Regards,
Finance Team
AstonomiQ`
    }

    return `Dear HIS Team,

A discrepancy has been detected in the reconciliation system.

Transaction ID: ${item.transaction_id}
Order ID: ${item.order_id}

Please verify the transaction entry in the HIS system.

Regards,
Finance Team
AstonomiQ`
  }

  useEffect(() => {

    const fetchData = async () => {
      try {

        const res = await fetch(API_URL)
        const response = await res.json()

        const data = Array.isArray(response) ? response : []

        const mappedData: ReconciliationItem[] = data.map((row: any) => ({

  transaction_id: row["HIS Transaction ID"],
  order_id: row["BILL Number"],

  paytm_source: row["PAYTM Transaction ID"],

  bnk_source: row["ARN"] || row["Net Amount Credited"],

  scenario_code: row["ScenarioCode"],

  result: row["Result"],

  justification: `Amount mismatch (HIS_NET=${row["HIS Net Amount"]}, PAYTM_NET=${row["PAYTM Net Amount"]}, BANK_NET=${row["Net Amount Credited"]}). ${row["Justification"] || ""}`,

  created_at: row["created_at"],

  discrepancy_source: detectSource(row, data)

}))

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

          <div className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 border-b bg-gray-50">
            <div className="flex-1">TRANSACTION</div>
            <div className="w-40 text-center">SCENARIO</div>
            <div className="w-20 text-right">ACTION</div>
          </div>

          {items.slice(0, visibleCount).map((item, index) => (

            <div key={index}>

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
                    onClick={() =>
                      setResolveExpanded(
                        resolveExpanded === item.transaction_id
                          ? null
                          : item.transaction_id
                      )
                    }
                  >
                    Resolve
                  </Button>
                </div>

              </div>

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

                    <div>
                      <p className="text-gray-400 uppercase tracking-wide">Error Source</p>
                      <p className="font-medium text-red-600">
                        {item.discrepancy_source}
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

              {resolveExpanded === item.transaction_id && (

                <div className="px-6 py-4 bg-white border-b">

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs mb-4">

                    <div>
                      <p className="text-gray-400 uppercase">Source</p>
                      <p className="font-medium">{item.discrepancy_source}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 uppercase">Send To</p>
                      <p className="font-medium">
                        {sourceEmailMap[item.discrepancy_source]}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 uppercase">CC</p>
                      <p className="font-medium">
                        Surjeet.kumar@astura.ai
                      </p>
                    </div>

                  </div>

                  <div className="border rounded-md p-3 bg-gray-50 mb-3">

                    <textarea
                      className="w-full text-xs bg-transparent outline-none"
                      rows={6}
                      value={
                        emailBody[item.transaction_id] ||
                        generateEmailBody(item)
                      }
                      readOnly={editingMail !== item.transaction_id}
                      onChange={(e) =>
                        setEmailBody({
                          ...emailBody,
                          [item.transaction_id]: e.target.value
                        })
                      }
                    />

                  </div>

                  <div className="flex gap-3">

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingMail(item.transaction_id)
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      className="bg-blue-600 text-white"
                      onClick={() => {

                        const body =
                          emailBody[item.transaction_id] ||
                          generateEmailBody(item)

                        window.location.href = `mailto:${
                          sourceEmailMap[item.discrepancy_source]
                        }?subject=Transaction Reconciliation Issue&body=${encodeURIComponent(body)}`
                      }}
                    >
                      Send Mail
                    </Button>

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