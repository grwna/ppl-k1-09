import { useLoanRequestStore } from "@/hooks/loanRequestStore";
import { useEffect } from "react";



export default function AdminLoanRequestPage() {

  const loans = useLoanRequestStore((state) => (state.loans))
  const selectedLoan = useLoanRequestStore((state) => (state.selected_loan))
 
  const setLoans = useLoanRequestStore((state) => (state.setLoans))
  const setSelectedLoan = useLoanRequestStore((state) => (state.setSelectedLoan))

  // fetch data from loan application table
  useEffect(() => {

    const fetchLoanApplication = async () => {

        try {
            const response = await fetch(`https://localhost:3000/loan/requests`)
            
            // Cast the JSON result to the 'User' type
            const data : any = response.json();
            setLoans(data.loan_value)

            return data;
        } catch (e) {
            console.log("Error at admin/loan-request/page.tsx");
        }
    }

    fetch
  }, [])

  return (<div>

    {/* table of loan application that can be pressed  */}

  </div>);
}
