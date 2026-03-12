"use client"

import { useEffect, useMemo, useState } from "react"
import { Typography } from "@/components/ui/typography"

type MISRow = Record<string, any>

/* Columns EXACTLY matching API response */
const COLUMN_ORDER = [
  "HIS Transaction ID",
  "UHID",
  "BILL Number",
  "BILL Date",
  "BILL Time",

  "HIS Gross Amount",
  "Discount",
  "HIS Net Amount",

  "Payment Mode",
  "Sub Mode",
  "Payment Status",

  "Gateway Reference ID",

  "PAYTM Transaction ID",
  "Card Number",
  "Bank",
  "ARN",

  "PAYTM Amount",
  "MDR Rate",
  "MDR Amount",
  "GST Amount",
  "PAYTM Net Amount",

  "PAYTM Status",
  "Refund Amount",

  "Settlement Date",
  "Settlement Time",

  "Net Amount Credited",
  "Remarks",

  "Difference",
  "ScenarioCode",
  "Result",
  "Justification",
  "created_at"
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
        } 
        else if (Array.isArray(res?.rows)) {
          rows = res.rows
        } 
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

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a,b)=> Number(b["BILL Date"] || 0) - Number(a["BILL Date"] || 0)
    )
  }, [data])

  if (loading) return <Typography>Loading MIS data…</Typography>

  if (error) return <Typography className="text-red-600">{error}</Typography>

  if (!sortedData.length)
    return <Typography>No MIS data available</Typography>

  const formatValue = (val:any, col:string, row:MISRow)=>{

    /* FORCE NA FOR CASH PAYMENTS */
    if(
      row["Payment Mode"] === "CASH" &&
      [
        "Gateway Reference ID",
        "PAYTM Transaction ID",
        "Card Number",
        "Bank",
        "ARN"
      ].includes(col)
    ){
      return "NA"
    }

    if(val===null || val===undefined) return ""
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

                <th className="border px-3 py-2 text-left font-semibold text-gray-700">
                  ROW NO
                </th>

                {COLUMN_ORDER.map(col => (

                  <th
                    key={col}
                    className="border px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {col}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {sortedData.map((row,i)=>(

                <tr key={i} className={i%2===0 ? "bg-white":"bg-gray-50"}>

                  <td className="border px-3 py-2 font-medium">
                    {i+1}
                  </td>

                  {COLUMN_ORDER.map(col => (

                    <td key={col} className="border px-3 py-2 whitespace-nowrap">
                      {formatValue(row[col], col, row)}
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