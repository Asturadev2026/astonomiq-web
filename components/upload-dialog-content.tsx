"use client"

import { useState, useRef } from "react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import {
  FileSpreadsheet,
  HelpCircle,
  CheckCircle,
} from "lucide-react"

type UploadType = "his" | "paytm" | "bank"

/* 🔒 Props kept OPTIONAL (safe, no breaking change) */
interface UploadDialogContentProps {
  onUploadComplete?: () => void
}

export function UploadDialogContent({
  onUploadComplete,
}: UploadDialogContentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentType, setCurrentType] = useState<UploadType | null>(null)
  const [files, setFiles] = useState<{
    his?: File
    paytm?: File
    bank?: File
  }>({})
  const [loading, setLoading] = useState(false)

  const triggerFilePicker = (type: UploadType) => {
    setCurrentType(type)
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentType) return

    if (!file.name.match(/\.(xls|xlsx)$/i)) {
      alert("Only Excel files (.xls, .xlsx) are allowed")
      return
    }

    setFiles((prev) => ({
      ...prev,
      [currentType]: file,
    }))

    e.target.value = ""
  }

  /* 🚀 DIRECT → n8n (NO backend, NO Supabase) */
  const handleUpload = async () => {
    if (!files.his || !files.paytm || !files.bank) {
      alert("Please upload all three files (HIS, Paytm, Bank)")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("his", files.his)
      formData.append("paytm", files.paytm)
      formData.append("bank", files.bank)

      /* ✅ Hardcoded email (as requested) */
      formData.append("email", "Apoorwa@astura.ai")

      const res = await fetch(
        "https://asturaintelligence.app.n8n.cloud/webhook/reconciliation/run",
        {
          method: "POST",
          body: formData, // ⚠️ multipart/form-data (DO NOT set headers)
        }
      )

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "n8n webhook failed")
      }

      onUploadComplete?.()

      alert("Files uploaded successfully.")
    } catch (err: any) {
      alert(err.message || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  const FileStatus = ({ label, file }: { label: string; file?: File }) => (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      {file ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <FileSpreadsheet className="h-4 w-4 text-gray-400" />
      )}
      <span>{label}</span>
    </div>
  )

  return (
    <DialogContent className="sm:max-w-xl p-0 bg-white gap-0">
      <div className="p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-semibold">
            Upload Reconciliation Files
          </DialogTitle>
        </DialogHeader>

        {/* Upload buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button variant="outline" onClick={() => triggerFilePicker("his")}>
            Upload HIS
          </Button>
          <Button variant="outline" onClick={() => triggerFilePicker("paytm")}>
            Upload Paytm
          </Button>
          <Button variant="outline" onClick={() => triggerFilePicker("bank")}>
            Upload Bank
          </Button>
        </div>

        {/* File status */}
        <div className="space-y-2 mb-6">
          <FileStatus label="HIS Transaction File" file={files.his} />
          <FileStatus label="Paytm Transaction File" file={files.paytm} />
          <FileStatus label="Bank Transaction File" file={files.bank} />
        </div>

        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".xls,.xlsx"
          onChange={handleFileSelect}
        />

        <Typography variant="body-sm" className="text-gray-400">
          Supported formats: XLS, XLSX • Max size: 25MB
        </Typography>
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex justify-between items-center">
        <Button variant="ghost" className="text-gray-500 flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Help Center
        </Button>
        <Button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Uploading..." : "Next"}
        </Button>
      </div>
    </DialogContent>
  )
}
