"use client"

import { useState, useRef } from "react"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { CloudUpload, FileSpreadsheet, HelpCircle } from "lucide-react"

export function UploadDialogContent() {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleZoneClick = () => {
        fileInputRef.current?.click()
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        console.log("File dropped:", e.dataTransfer.files)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log("File selected:", e.target.files[0])
        }
    }

    return (
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white gap-0">
            <div className="p-6">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-semibold">Upload file</DialogTitle>
                </DialogHeader>

                {/* Drop Zone */}
                <div
                    className={`
                        relative flex flex-col items-center justify-center w-full h-64 
                        border-2 border-dashed rounded-lg transition-colors cursor-pointer
                        ${isDragging ? "border-blue-500 bg-blue-50" : "border-blue-200 bg-blue-50/50"}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleZoneClick}
                >
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept=".xls,.xlsx"
                    />
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <CloudUpload className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <Typography variant="body-md" className="font-medium">
                                Drag and Drop file here or{" "}
                                <span className="text-blue-600 underline hover:text-blue-700 font-semibold cursor-pointer">
                                    Choose file
                                </span>
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* Info Text */}
                <div className="flex justify-between mt-4 text-gray-400 text-xs">
                    <span>Supported formats: XLS, XLSX</span>
                    <span>Maximum size: 25MB</span>
                </div>

                {/* Example Card */}
                <div className="mt-8 flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <Typography variant="label-md" className="font-semibold block text-gray-900">
                                Table Example
                            </Typography>
                            <Typography variant="body-sm" className="text-gray-500 max-w-[280px] leading-tight mt-0.5">
                                You can download the attached example and use them as a starting point for your own file.
                            </Typography>
                        </div>
                    </div>
                    <Button variant="outline" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 font-medium">
                        Download
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
                <Button variant="ghost" className="text-gray-500 hover:text-gray-700 hover:bg-transparent px-0 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Help Center</span>
                </Button>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="font-medium text-gray-700 min-w-[80px]">
                        Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium min-w-[80px]">
                        Next
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}
