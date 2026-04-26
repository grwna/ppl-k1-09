
import Image from "next/image";

import WhiteChecklist from "../../../../public/white-checklist.svg"
import { useEffect, useState } from "react";
import { useUserStore } from "@/hooks/userStore";

export default function ApplicantDashboard_ApplicationProgressComponent(props: {submitTime : Date, verifiedTime : Date, disbursedTime : Date}){

    return (

        // main container
        <div className="flex flex-col w-full h-full justify-center items-start gap-2 p-2">
            
            {/* title */}
            <div className="flex justify-start items-center w-full h-fit px-2 pt-2 font-semibold text-lg">
                Application Progress
            </div>

            {/* progress */}
            <div className="flex flex-col justify-center items-center gap-2">

                {/* submitted section */}
                <div className="flex w-full h-fit justify-start items-center">
                    
                    {/* symbols */}
                    <div className="flex justify-center items-center bg-[#009966] rounded-full p-2 w-[10%]">
                        <Image
                            src={WhiteChecklist}
                            alt="White checklist"
                        />  
                    </div>

                    {/* title + caption + date */}
                    <div className="flex flex-col justify-center items-start w-[90%] p-2">
                        
                        {/* title */}
                        <div className="text-lg font-semibold">
                            Submitted
                        </div>

                        {/* caption */}
                        <div className="font-light">
                            Your Applcation has been received
                        </div>

                        {/* date */}
                        <div className="text-sm font-light opacity-80">
                            Compleeted on Aug 15, 2026
                        </div>

                    </div>

                </div>

                {/* verified section */}
                <div className="flex w-full h-fit justify-between items-center">
                    
                    {/* symbols */}
                    <div className="flex justify-center items-center bg-[#009966] rounded-full p-2 w-[10%]">
                        <Image
                            src={WhiteChecklist}
                            alt="White checklist"
                        />  
                    </div>

                    {/* title + caption + date */}
                    <div className="flex flex-col justify-center items-start w-[90%] p-2">
                        
                        {/* title */}
                        <div className="text-lg font-semibold">
                            Verified
                        </div>

                        {/* caption */}
                        <div className="font-light">
                            Documents and information verified
                        </div>

                        {/* date */}
                        <div className="text-sm font-light opacity-80">
                            Completed on Aug 18, 2026
                        </div>

                    </div>

                </div>

                {/* disbursed section */}
                <div className="flex w-full h-fit justify-between items-center">
                    
                    {/* symbols */}
                    <div className="flex justify-center items-center bg-[#009966] rounded-full p-2 w-[10%]">
                        <Image
                            src={WhiteChecklist}
                            alt="White checklist"
                        />  
                    </div>

                    {/* title + caption + date */}
                    <div className="flex flex-col justify-center items-start w-[90%] p-2">
                        
                        {/* title */}
                        <div className="text-lg font-semibold">
                            Disbursed
                        </div>

                        {/* caption */}
                        <div className="font-light">
                            Funds transferred to your account
                        </div>

                        {/* date */}
                        <div className="text-sm font-light opacity-80">
                            Completed on Aug 20, 2026
                        </div>

                    </div>

                </div>

            </div>

            {/* view details + download contracts section */}
            <div className="flex justify-between items-center w-full h-fit p-2 gap-4">

                {/* view details */}
                <div className="flex justify-center items-center w-1/2 h-fit text-white bg-[#07B0C8] rounded-lg p-2">
                    Lihat Detail
                </div>

                {/* download contracts */}
                <div className="flex justify-center items-center w-1/2 h-fit text-[#07B0C8] border border-2 border-[#07B0C8] rounded-lg font-semibold p-2">
                    Unduh Kontrak
                </div>
            </div>

        </div>
    );
}