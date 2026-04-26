


"use client"

import { useRef } from "react"
import { useApplicationProgressStore } from "@/hooks/applicationProgressStore"
import ApplicantForm_DocumentFilePreview from "./document_file_preview"

export default function ApplicantForm_FamilyCardUploadBlock() {
    
    const fileRef = useRef<HTMLInputElement>(null)
    const familyCard = useApplicationProgressStore((state) => (state.family_card))

    const setFamilyCard = useApplicationProgressStore((state) => (state.setFamilyCard))

    const handleClick = () => {
        fileRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected) setFamilyCard(selected)
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

        <ApplicantForm_DocumentFilePreview file={familyCard} onClick={handleClick} />

    </div>
  )
}
