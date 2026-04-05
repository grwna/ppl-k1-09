

import { useApplicationProgressStore } from "@/hooks/applicationProgressStore"

export default function ApplicantForm_TermsAndAgreementSection() {

    const handleSubmitApplication = async () => {
    
        // construct the object to be sent
        const full_name = useApplicationProgressStore((state) => state.full_name)
        const university_name = useApplicationProgressStore((state) => state.university_name)
        const student_id_number = useApplicationProgressStore((state) => state.student_id_number)
        const loan_title = useApplicationProgressStore((state) => state.loan_title)
        const requested_amount = useApplicationProgressStore((state) => state.requested_amount)
        const loan_purpose = useApplicationProgressStore((state) => state.loan_purpose)
        const family_card_file = useApplicationProgressStore((state) => state.family_card)
        const student_id_card_file = useApplicationProgressStore((state) => state.student_id_card)
        const terms_and_agreement_compliance = useApplicationProgressStore((state) => state.comply_to_terms_and_agreement)
        
        if (!full_name || !university_name || !student_id_number || !loan_title || !requested_amount || !loan_purpose || !family_card_file || !student_id_card_file) return

        const formData = new FormData()
        formData.append("full_name", full_name)
        formData.append("university_name", university_name)
        formData.append("student_id_number", student_id_number)
        formData.append("loan_title", loan_title)
        formData.append("requested_amount", String(requested_amount))
        formData.append("loan_purpose", loan_purpose)
        formData.append("student_id_card_file", student_id_card_file)
        formData.append("family_card_file", family_card_file)
        formData.append("terms_and_agreement_compliance", String(terms_and_agreement_compliance))

        await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })
    }

    const decrementStep = useApplicationProgressStore((state) => state.decrementStep)
    const switchComplyToTermsAndAgreement = useApplicationProgressStore((state) => state.switchComplyToTermsAndAgreement)

    const handleBack = async () => {
        decrementStep()
    }

    return (

        // main container
        <div className="flex flex-col w-full h-fit">

            {/* title */}
            <div>
                Terms & Agreement
            </div>

            {/* captions */}
            <div>
                Please review and accept the loan agreement terms
            </div>

            {/* terms and agreement */}
            <div>

                {/* title */}
                <div>
                    Interest-Free Loan Agreement
                </div>

                {/* intro agreement part */}
                <div>
                    By submitting this application, you acknowledge and agree to the following terms and conditions of the Rumah Amal Salman interest-free student loan program:
                </div>

                {/* 1 : principles */}
                <div>

                    {/* statement */}
                    <div>
                        This is an interest-free loan (Qardhul Hasan) provided to support your education through Islamic philanthropy principles.
                    </div>

                    {/* points of document requirements */}
                    <div>
                        <ul>
                            <li>You agree to repay the loan amount in monthly installments as agreed upon after loan approval.</li>
                            <li>No interest or additional fees will be charged on this loan. The repayment amount equals the borrowed amount.</li>
                            <li>All information provided in this application is accurate and truthful to the best of your knowledge.</li>
                            <li>You authorize Rumah Amal Salman to verify the information and documents provided.</li>
                            <li>You commit to using the loan funds solely for educational purposes as stated in your application.</li>
                        </ul>
                    </div>

                </div>

                {/* 2 : other stuffs */}
                <div>

                    {/* statement */}
                    <div>
                        In case of financial hardship, you agree to communicate promptly with Rumah Amal Salman to discuss alternative repayment arrangements.
                    </div>

                    {/* points of document requirements */}
                    <div>
                        <ul>
                            <li>You understand that this loan is a trust (amanah) and you are morally and ethically obligated to repay it.</li>
                        </ul>
                    </div>

                </div>

            </div>

            {/* compliance from the user section */}
            <div className="flex justify-center items-center w-full h-fit">

                {/* cta action */}
                <input
                    type="checkbox"
                    onChange={(e) => {switchComplyToTermsAndAgreement()}}
                    onKeyDown={(e) => e.key === "Enter"}
                    className={ `flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl`}
                />

                {/* statement */}
                <div>
                    I have read and agree to the interest-free loan agreement terms and conditions. I confirm that all information provided is accurate and I commit to fulfilling my repayment obligations.
                </div>

            </div>

            {/* cta button */}
            <div className="flex w-full h-fit">

                {/* back button */}
                <div onClick={handleBack}>
                    Back
                </div>

                {/* continue button */}
                <div onClick={handleSubmitApplication}>
                    Submit Application
                </div>
            </div>

        </div>
    );
}