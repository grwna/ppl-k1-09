"use client"

import { useLoanRequestStore } from "@/hooks/loanRequestStore";
import DummyUserLogo from "../../../../../public/dummy-user.svg"
import DummyDocsLogo from "../../../../../public/dummy-docs.svg"
import ArrowRightGreyLogo from "../../../../../public/arrow-right-grey.svg"
import { time, timeStamp } from "console";
import Image from "next/image";
import AdminDashboard_AdminNavbar from "@/components/ui/admin-dashboard/admin_navbar";
import MapFundsModal from "@/components/ui/loan-request/fund_allocation_card";

const StatusActionDict = {
    "PENDING" : {
        "status_color" : "#FEF3C6",
        "text_color" : "#BB4D00",
        "action_caption" : "Review",
        "action_color" : "#00B5D8",
        "action_caption_color" : "#00B5D8",
        // "path" : "/admin/loan"
    },
    "APPROVED" : {
        "status_color" : "#D0FAE5",
        "text_color" : "#007A55",
        "action_caption" : "See Detail",
        "action_color" : "#FCB82E",
        "action_caption_color" : "#FCB82E",
        // "path" : "/admin/loan-reque/st/review"
    },
    "REJECTED" : {
        "status_color" : "#FFE2E2",
        "text_color" : "#C10007",
        "action_caption" : "See Detail",
        "action_color" : "#FCB82E",
        "action_caption_color" : "#FCB82E",
        // "path" : '/admin/loan-request/review'
    },
}

export default function ReviewLoanApplicationPage() {

    // get the loan application selected before
    const selectedLoan = useLoanRequestStore((state) => (state.selected_loan))
    const submitTime = new Date(Date.now() - Number(selectedLoan?.createdAt)).toLocaleString()
    const approvedAmount = useLoanRequestStore((state) => (state.selected_loan?.approvedAmount))
    const rejectionApprovalNote = useLoanRequestStore((state) => (state.selected_loan.rejectionApprovalNotes))
    const studentIdCard = selectedLoan?.studentIdCard
    const transcriptFile = selectedLoan?.transcriptFile
    const documents : (File | string | null | undefined)[] = [ studentIdCard , transcriptFile ]
    const isAllocationFundModalOpen = useLoanRequestStore((state) => (state.isAllocationFundModalOpen))

    const setApprovedAmount = useLoanRequestStore((state) => (state.setApprovedAmount))
    const setRejectionApprovalNote = useLoanRequestStore((state) => (state.setRejectionApprovalNote))
    const setAllocationFundModalOpen = useLoanRequestStore((state) => (state.setAllocationFundModalOpen))


    const dummyDescription = `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Praesentium magni, facere, est laborum cumque expedita sed saepe dignissimos aliquam, 
        hic quam quis dicta harum veniam nihil tempora rerum sequi consectetur.
    `
    return (
        <div className="flex flex-col justify-start items-center w-full min-h-screen bg-[#F9FAFB]">

            { isAllocationFundModalOpen ? 
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <MapFundsModal /> 
                </div> 
            : 
                <></>
            }
            {/* navbar */}
            <div className="flex justify-center items-center w-full h-fit">
                <AdminDashboard_AdminNavbar />
            </div>
            
            {/* title */}
            <div className="flex flex-col justify-center items-center w-[90%] h-fit gap-4 py-10">

                {/* back to requests */}
                <div className="flex w-full h-fit justify-start items-center pt-4 gap-2 px-2">

                    {/* arrow left grey logo */}
                    <div className="w-fit h-fit justify-start items-center">
                        <Image
                            src={ArrowRightGreyLogo}
                            alt="Left Arrow"
                            height={20}
                            width={20}
                            className="rotate-180"
                        />
                    </div>

                    {/* caption */}
                    <div className="w-fit h-fit justify-start items-center">
                        Kembali ke daftar pengajuan pinjaman
                    </div>
                </div>

                {/* main title */}
                <div className="flex w-full h-fit justify-start items-center font-bold text-4xl">
                    Tinjau Pengajuan Pinjaman
                </div>

                {/* id + status loan application */}
                <div className="flex w-full h-fit justify-between items-center">

                    {/* application id + how recent */}
                    <div className="font-light text-sm text-gray-500">
                        Pengajuan {selectedLoan?.loanApplicationId || "YYYYY-ZZZZZ"} &bull; Diajukan pada {submitTime}
                    </div>

                    {/* status tag */}
                    {(() => {
                        const statusKey = (selectedLoan?.status?.toUpperCase() || "PENDING") as keyof typeof StatusActionDict;
                        const config = StatusActionDict[statusKey];

                        return (
                            <div 
                                className="py-2 px-6 font-semibold flex justify-center items-center rounded-full text-xs border" 
                                style={{ 
                                    color: config.text_color,
                                    backgroundColor: config.status_color,
                                    borderColor: config.text_color // You can use borderColor specifically
                                }}
                            >
                                {selectedLoan?.status || "PENDING"}
                            </div>
                        );
                    })()}

                </div>
                
            </div>
            

            {/* main section container */}
            <div className="flex justify-center items-start w-[90%] h-fit gap-4 pb-10">

                {/* applicant information + supporting docs + reason for loan section */}
                <div className="flex flex-col w-[75%] h-fit gap-6">
                    
                    {/* applicant information */}
                    <div className="flex flex-col justify-center items-center w-full h-fit p-4 rounded-2xl shadow-xl bg-white">

                        {/* title */}
                        <div className="flex justify-start items-center font-bold w-full h-fit">
                            Informasi Pengaju Pinjaman
                        </div>

                        {/* photo + personal information */}
                        <div className="flex justify-center items-center w-full h-fit">

                            {/* photo section */}
                            <div className="flex justify-center items-center w-[25%] h-fit">
                                <Image 
                                    src={DummyUserLogo}
                                    alt="Dummy user logo"
                                />
                            </div>

                            {/* personal information section */}
                            <div className="w-[75%] h-fit justify-start items-center flex flex-col gap-2">
                                
                                {/* full name + student number id container*/}
                                <div className="flex w-full justify-center items-center h-fit">
                                    
                                    {/* full name section */}
                                    <div className="flex flex-col gap-2 justify-center items-center w-[40%] h-fit">

                                        {/* title */}
                                        <div className="w-full h-fit justify-start items-center flex text-gray-400 text-sm">
                                            Nama Lengkap
                                        </div>

                                        {/* content */}
                                        <div className="w-full h-fit justify-start items-center flex font-semibold">
                                            {selectedLoan?.name || "DUMMY NAME"}
                                        </div>
                                        
                                    </div>
                                    
                                    {/* full name section */}
                                    <div className="flex flex-col gap-2 justify-center items-center w-[60%] h-fit">

                                        {/* title */}
                                        <div className="w-full h-fit justify-start items-center flex text-gray-400 text-sm">
                                            Nomor Induk Mahasiswa / Nomor Induk Pegawai (NIM/NIP)
                                        </div>

                                        {/* content */}
                                        <div className="w-full h-fit justify-start items-center flex font-semibold">
                                            {selectedLoan?.idNumber || "XXXXXX"}
                                        </div>

                                    </div>
                                    
                                </div>

                                {/* institution section */}
                                <div className="flex flex-col w-full justify-center items-center h-fit gap-2">

                                    {/* institution title */}
                                    <div className="w-full h-fit justify-start items-center flex text-gray-400 text-sm">
                                        Institusi
                                    </div>

                                    {/* institution name */}
                                    <div className="w-full h-fit justify-start items-center flex font-semibold">
                                        {selectedLoan?.institution || "Institut Teknologi Bandung"}
                                    </div>

                                </div>

                                {/* intake year + current address section */}
                                <div className="flex w-full justify-center items-center h-fit">
                                    
                                    {/* tahun ajaran section */}
                                    <div className="flex flex-col gap-2 justify-center items-center w-[40%] h-fit">

                                        {/* title */}
                                        <div className="w-full h-fit justify-start items-center flex text-gray-400 text-sm">
                                            Tahun Ajaran
                                        </div>

                                        {/* content */}
                                        <div className="w-full h-fit justify-start items-center flex font-semibold">
                                            {selectedLoan?.intakeYear || 2026}
                                        </div>
                                        
                                    </div>
                                    
                                    {/* alamat terkini section */}
                                    <div className="flex flex-col gap-2 justify-center items-center w-[60%] h-fit">

                                        {/* title */}
                                        <div className="w-full h-fit justify-start items-center flex text-gray-400 text-sm">
                                            Alamat Terkini
                                        </div>

                                        {/* content */}
                                        <div className="w-full h-fit justify-start items-center flex font-semibold">
                                            {selectedLoan?.address || "Jl. Tubagus Ismail Raya No. 12, Bandung"}
                                        </div>

                                    </div>
        
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Supporting Documents Section */}
                    <div className="flex flex-col w-full h-fit p-6 rounded-2xl shadow-sm border border-gray-100 bg-white gap-6">
                    
                    {/* Title */}
                    <div className="text-lg font-bold text-slate-800">
                        Supporting Documents
                    </div>

                    {/* Grid of documents */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.filter(Boolean).map((doc, index) => {
                            // 1. Determine if it's a File object or a String URL
                            const isFileObject = doc instanceof File;
                            const isImage = isFileObject 
                            ? doc.type.startsWith('image/') 
                            : typeof doc === 'string' && (doc.match(/\.(jpeg|jpg|gif|png)$/) != null);

                            // 2. Resolve the source
                            // If it's a File, create a blob. If it's a string, use it directly.
                            const imgSrc = isFileObject ? URL.createObjectURL(doc) : (doc as string);

                            return (
                            <div key={index} className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white">
                                
                                {/* Top Section: Thumbnail */}
                                <div className="relative w-full h-52 bg-gray-50 flex items-center justify-center">
                                {isImage ? (
                                    <Image 
                                    src={imgSrc} 
                                    alt={`Document ${index}`} 
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover" // This makes it fill the container
                                    onLoad={() => {
                                        if (isFileObject) URL.revokeObjectURL(imgSrc);
                                    }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Image src={DummyDocsLogo} alt="File icon" className="w-full h-full flex justify-center items-center object-cover" fill />
                                        <span className="text-xs text-gray-400">PDF Document</span>
                                    </div>
                                )}
                                </div>

                                {/* Bottom Section: Details */}
                                <div className="p-4 flex justify-between items-center bg-white border-t border-gray-100">
                                    <div className="flex flex-col gap-1 overflow-hidden">
                                        <span className="font-semibold text-sm text-slate-700 truncate">
                                            {(isFileObject && doc.name) ? doc.name : `Document_1`}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {(isFileObject && doc.size) ? `${(doc.size / (1024 * 1024)).toFixed(1)} MB` : "1.2 MB"} &bull; Uploaded 2h ago
                                        </span>
                                    </div>

                                    <button className="p-2 hover:bg-gray-100 rounded-full shrink-0 transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </button>
                                </div>
                                
                            </div>
                            );
                        })}
                        </div>
                    </div>

                    {/* reason for loan section */}
                    <div className="flex flex-col justify-center items-center w-full h-fit p-4 rounded-2xl shadow-2xl bg-white gap-2">

                        {/* title */}
                        <div className="flex justify-start items-center w-full h-fit font-bold">
                            Deskripsi Pinjaman
                        </div>

                        {/* reason gor loan content */}
                        <div className="w-full h-fit p-4 bg-[#F1F5F9] justify-center items-center rounded-2xl">
                            {selectedLoan?.description || dummyDescription}
                        </div>
                        
                    </div>

                </div>

                {/* admin actions section */}
                <div className="flex flex-col w-[25%] h-fit justify-center items-center p-4 rounded-2xl bg-white shadow-2xl gap-4">
                            
                    {/* title */}
                    <div className="flex justify-start items-center w-full h-fit font-bold p-2">
                        Aksi Admin
                    </div>

                    {/* requested amount section */}
                    <div className="flex flex-col justify-center items-center w-full h-fit bg-[#F1F5F9] rounded-2xl p-4">
                        
                        {/* title */}
                        <div className="w-full h-fit justify-start items-center flex text-gray-400 text-sm">
                            Jumlah pinjaman yang diajukan
                        </div>

                        {/* request amount content */}
                        <div className="flex justify-start items-center w-full h-fit font-bold text-3xl">
                            {selectedLoan?.requestedAmount}
                        </div>
                        
                    </div>

                    {/* approved amount section */}
                    <div className="flex flex-col justify-center items-center w-full h-fit p-2 gap-2">

                        {/* title */}
                        <div className="w-full h-fit justify-start items-center flex text-sm font-semibold">
                            Jumlah yang disetujui
                        </div>

                        {/* approved amount input */}
                        <div className="flex justify-start items-center w-full h-fit font-bold text-xl">
                            <input
                                value={approvedAmount}
                                onChange={(e) => setApprovedAmount(Number(e.target.value))}
                                onKeyDown={(e) => e.key === "Enter"}
                                className="border border-black/20 bg-white p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                                placeholder="Masukkan nilai yang disetujui..."
                            />
                        </div>
                    </div>

                    {/* rejection / approval notes section */}
                    <div className="flex flex-col justify-center items-center w-full h-fit pb-2 px-2 gap-2">
                        
                        {/* title */}
                        <div className="w-full h-fit justify-start items-center flex text-sm font-semibold">
                            Alasan Penerimaan / Penolakan
                        </div>

                        {/* rejection / approval notes input */}
                        <div className="w-full min-h-24 flex justify-center items-center">
                            <textarea
                                value={rejectionApprovalNote}
                                onChange={(e) => setRejectionApprovalNote(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter"}
                                className="border border-black/20 bg-white p-3 rounded-xl w-full h-48 focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                                placeholder="Masukkan alasan untuk keputusan yang diambil..."
                            />
                        </div>

                    </div>

                    {/* approve loan button */}
                    <div className="flex w-full h-fit p-4 bg-[#07B0C8] text-white justify-center items-center rounded-lg" onClick={() => setAllocationFundModalOpen(!isAllocationFundModalOpen)}>
                        Setujui Pinjaman
                    </div>

                    {/* reject application button */}
                    <div className="flex w-full h-fit p-4 border border-red-500 text-red-500 justify-center items-center rounded-lg font-semibold">
                        Tolak Pengajuan Pinjaman
                    </div>

                </div>

            </div>

        </div>
    );
}