import { useLoanRequestStore } from "@/hooks/loanRequestStore";
import DummyUserLogo from "../../../../../public/dummy-user.svg"
import DummyDocsLogo from "../../../../../public/dummy-docs.svg"
import { time, timeStamp } from "console";
import Image from "next/image";

export default function ReviewLoanApplicationPage() {

    // get the loan application selected before
    const selectedLoan = useLoanRequestStore((state) => (state.selected_loan))
    const submitTime = new Date(Date.now() - Number(selectedLoan?.createdAt)).toLocaleString()
    const approvedAmount = useLoanRequestStore((state) => (state.selected_loan?.approvedAmount))
    const rejectionApprovalNote = useLoanRequestStore((state) => (state.selected_loan.rejectionApprovalNotes))
    const studentIdCard = selectedLoan?.studentIdCard
    const transcriptFile = selectedLoan?.transcriptFile
    const documents = [ studentIdCard , transcriptFile ]

    const setApprovedAmount = useLoanRequestStore((state) => (state.setApprovedAmount))
    const setRejectionApprovalNote = useLoanRequestStore((state) => (state.setRejectionApprovalNote))

    return (
        <div>
            
            {/* title */}
            <div>

                {/* back to requests */}
                <div>
                    &lt;- Kembali ke daftar pengajuan pinjaman
                </div>

                {/* main title */}
                <div>

                </div>

                {/* id + status loan application */}
                <div className="flex">

                    {/* application id + how recent */}
                    <div>
                        Application {selectedLoan?.loanApplicationId} &bull; Submitted at {submitTime}
                    </div>

                    {/* status */}
                    <div>
                        {selectedLoan?.status}
                    </div>

                </div>
        
            </div>
            

            {/* main section container */}
            <div className="flex justify-center items-start">

                {/* applicant information + supporting docs + reason for loan section */}
                <div>
                    
                    {/* applicant information */}
                    <div className="">

                        {/* title */}
                        <div>
                            Informasi Pengaju Pinjaman
                        </div>

                        {/* photo + personal information */}
                        <div className="flex">

                            {/* photo section */}
                            <div>
                                <Image 
                                    src={DummyUserLogo}
                                    alt="Dummy user logo"
                                />
                            </div>

                            {/* personal information section */}
                            <div>
                                
                                {/* full name + student number id */}
                                <div className="flex">
                                    
                                    {/* full name section */}
                                    <div>

                                        {/* title */}
                                        <div>
                                            Full name
                                        </div>

                                        {/* content */}
                                        <div>
                                            {selectedLoan?.name}
                                        </div>
                                        
                                    </div>
                                    
                                    {/* full name section */}
                                    <div>

                                        {/* title */}
                                        <div>
                                            Student ID (NIM)
                                        </div>

                                        {/* content */}
                                        <div>
                                            {selectedLoan?.idNumber}
                                        </div>

                                    </div>
                                    
                                </div>

                            </div>

                            {/* institution */}
                            <div>
                                {selectedLoan?.institution}
                            </div>

                            {/* intake year + current address section */}
                            <div>
                                
                                {/* intake year + student number id */}
                                <div className="flex">
                                    
                                    {/* full name section */}
                                    <div>

                                        {/* title */}
                                        <div>
                                            Intake Year
                                        </div>

                                        {/* content */}
                                        <div>
                                            {selectedLoan?.intakeYear}
                                        </div>
                                        
                                    </div>
                                    
                                    {/* full name section */}
                                    <div>

                                        {/* title */}
                                        <div>
                                            Current Address
                                        </div>

                                        {/* content */}
                                        <div>
                                            {selectedLoan?.address}
                                        </div>

                                    </div>
                                    
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* supporting documents */}
                    <div>

                        {/* title : supporting documents */}
                        <div className="flex justify-start items-center w-full h-fit font-bold">
                            Supporting Documents
                        </div>

                        {/* array of documents */}
                        <div className="flex">

                            {documents.map((doc, index) => {
                                // Check if the file MIME type starts with 'image/'
                                const isImage = doc.type && doc.type.startsWith('image/');
                                
                                // Generate a temporary preview URL for the image
                                const imageUrl = isImage ? URL.createObjectURL(doc) : "";

                                return (
                                    <div key={index} className="document-preview">
                                        {isImage ? (
                                            <img 
                                                src={imageUrl} 
                                                alt={doc.name} 
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                // Best practice: Clean up memory after the image loads
                                                onLoad={() => URL.revokeObjectURL(imageUrl)}
                                            />
                                        ) : (
                                            <Image 
                                                src={DummyDocsLogo}
                                                alt="Dummy docs logo"
                                            />
                                        )}
                                        <p>{doc.name}</p>
                                    </div>
                                );
                            })}

                        </div>

                    </div>

                    {/* reason for loan section */}
                    <div className="flex flex-col">

                        {/* title */}
                        <div>
                            Deskripsi Pinjaman
                        </div>

                        {/* reason gor loan content */}
                        <div>
                            {selectedLoan?.description}
                        </div>
                        
                    </div>

                </div>

                {/* admin actions section */}
                <div>
                            
                    {/* title */}
                    <div>
                        Admin Actions
                    </div>

                    {/* requested amount section */}
                    <div>
                        
                        {/* title */}
                        <div>
                            Requested Amount
                        </div>

                        {/* request amount content */}
                        <div>
                            {selectedLoan?.requestedAmount}
                        </div>
                        
                    </div>

                    {/* approved amount section */}
                    <div>

                        {/* title */}
                        <div>
                            Approved Amount
                        </div>

                        {/* approved amount input */}
                        <div>
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
                    <div>
                        
                        {/* title */}
                        <div>
                            Rejection / Approval Notes
                        </div>

                        {/* rejection / approval notes input */}
                        <div>
                            <input
                                value={rejectionApprovalNote}
                                onChange={(e) => setRejectionApprovalNote(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter"}
                                className="border border-black/20 bg-white p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                                placeholder="Masukkan alasan untuk keputusan yang diambil..."
                            />
                        </div>

                    </div>

                    {/* approve loan button */}
                    <div className="flex w-full h-fit p-2 bg-[#07B0C8] text-white justify-center items-center">
                        Approve Loan
                    </div>

                    {/* reject application button */}
                    <div className="flex w-full h-fit p-2 border border-red-500 text-red-500 justify-center items-center">
                        Reject Application
                    </div>

                </div>

            </div>

        </div>
    );
}