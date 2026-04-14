


"use client"

import { useRef } from "react"
import { useApplicationProgressStore } from "@/hooks/applicationProgressStore"

export default function ApplicantForm_FamilyCardUploadBlock() {
    
    const fileRef = useRef<HTMLInputElement>(null)
    const familyCard = useApplicationProgressStore((state) => (state.family_card))

    const handleClick = () => {
        fileRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected) useApplicationProgressStore((state) => {state.setFamilyCard(selected)})
    }

    return (
        <div className="w-full h-full flex flex-col gap-4 items-center">
        
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
            className="w-full h-40 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100"
        >
            Upload
        </div>

        {/* Preview */}
        {familyCard && (
            <div className="text-sm">
            Selected: {familyCard.name}
            </div>
        )}

    </div>
  )
}
