
import { useDonationStore } from "@/hooks/donationStore";
import Link from "next/link";

export default function DonorDashboard_StartNewDonation() {

    // initialize variables
    const donationAmount = useDonationStore((state) => state.donation?.value)
    
    return (
        // main container
        <div className=" flex flex-col items-start justify-start bg-[#07B0C8] rounded-2xl p-2">
        
            {/* title */}
            <div className="text-white flex justify-start items-center h-[10%] w-full font-sans font-bold">
                Start New Donation
            </div>

            {/* introduction */}
            <div className="text-white flex justify-start items-start h-[20%] w-[80%] text-start font-sans">
                Your contribution helps students achieve their educational dreams without the burden of interest.
            </div>

            {/* donation amount */}
            <div className="flex flex-col justify-center items-center w-full h-[20%] ">
                {/* title */}
                <div className="flex justify-start items-center w-full text-white">
                    Donation Amount
                </div>

                {/* input new donation amount */}
                <input
                    value={donationAmount}
                    onChange={(e) => useDonationStore((state) => state.setAmount(Number(e.target.value)))}
                    onKeyDown={(e) => e.key === "Enter"}
                    className="flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl"
                    placeholder="Rp0"
                />
            </div>
            
            {/* quick select */}
            <div className="flex justify-between items-center h-[20%] w-full">
                
                {/* 1 juta */}
                <div className="flex justify-center items-center text-white">
                    Rp1 Juta
                </div>

                {/* 5 juta */}
                <div className="flex justify-center items-center text-white">
                    Rp5 Juta
                </div>

                {/* 10 juta */}
                <div className="flex justify-center items-center text-white">
                    Rp10 Juta
                </div>
            </div>

            {/* call to action (make donation) */}
            <div className="flex justify-center items-center h-[30%] w-full text-white">
                <Link href={"/d"}>
                    Make Donation
                </Link>
            </div>

        </div>
    );
}