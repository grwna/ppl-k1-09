


"use client"

import { useRef } from "react"
import { useApplicationProgressStore } from "@/hooks/applicationProgressStore"

export default function ApplicantForm_StudentIdCardUploadBlock() {
    
    const fileRef = useRef<HTMLInputElement>(null)
    const studentIdCard = useApplicationProgressStore((state) => (state.student_id_card))

    const handleClick = () => {
        fileRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected) useApplicationProgressStore((state) => {state.setStudentIdCard(selected)})
    }

    return (
        <div className="flex flex-col gap-4 items-center">
        
        {/* Hidden input */}
        <input
            type="file"
            ref={fileRef}
            onChange={handleFileChange}
            className="hidden"
        />

        {/* Custom upload button */}
        <div
            onClick={handleClick}
            className="w-40 h-40 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100"
        >
            Upload
        </div>

        {/* Preview */}
        {studentIdCard && (
            <div className="text-sm">
            Selected: {studentIdCard.name}
            </div>
        )}

    </div>
  )
}
