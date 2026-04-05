
import Image from "next/image";

import WhiteChecklist from "../../../../public/white-checklist.svg"

export default function ApplicantDashboard_ApplicationProgressComponent(){

    // fetch conditions from the db

    return (

        // main container
        <div className="flex flex-col w-full h-fit">
            
            {/* title */}
            <div>
                Application Progress
            </div>

            {/* progress */}
            <div>

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
                        <div>
                            Submitted
                        </div>

                        {/* caption */}
                        <div>
                            Your Applcation has been received
                        </div>

                        {/* date */}
                        <div>
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
                        <div>
                            Verified
                        </div>

                        {/* caption */}
                        <div>
                            Documents and information verified
                        </div>

                        {/* date */}
                        <div>
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
                        <div>
                            Disbursed
                        </div>

                        {/* caption */}
                        <div>
                            Funds transferred to your account
                        </div>

                        {/* date */}
                        <div>
                            Completed on Aug 20, 2026
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}