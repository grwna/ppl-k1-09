"use client"

import { FileText, Image as ImageIcon, Upload } from "lucide-react"
import { useMemo } from "react"

type DocumentFilePreviewProps = {
    file: File | null
    onClick: () => void
}

function formatFileSize(size: number) {
    if (size < 1024 * 1024) {
        return `${Math.max(1, Math.round(size / 1024))} KB`
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function ApplicantForm_DocumentFilePreview({ file, onClick }: DocumentFilePreviewProps) {
    const previewUrl = useMemo(() => {
        if (!file || !file.type.startsWith("image/")) {
            return null
        }

        return URL.createObjectURL(file)
    }, [file])

    if (!file) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-white text-gray-500 transition hover:border-[#009966] hover:bg-emerald-50"
            >
                <Upload size={28} />
                <span className="text-sm font-medium">Upload dokumen</span>
                <span className="text-xs">JPG, PNG, atau PDF</span>
            </button>
        )
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left transition hover:border-[#009966] hover:bg-emerald-100"
        >
            <div className="flex h-28 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-emerald-200 bg-white">
                {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={previewUrl}
                        alt={file.name}
                        className="h-full w-full object-cover"
                    />
                ) : file.type === "application/pdf" ? (
                    <FileText className="text-red-500" size={40} />
                ) : (
                    <ImageIcon className="text-gray-500" size={40} />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-900">
                    {file.name}
                </div>
                <div className="mt-1 text-xs text-gray-600">
                    {formatFileSize(file.size)} • {file.type || "Unknown type"}
                </div>
                <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-[#007a4d]">
                    Klik untuk mengganti dokumen
                </div>
            </div>
        </button>
    )
}
