
import Image from "next/image";

import GreenChecklist from  "../../../../public/green-checklist.svg"

import { useApplicationProgressStore } from "@/hooks/applicationProgressStore";


export default function ApplicantForm_ApplicationProgressSection() {

    const applicationProgress = useApplicationProgressStore((state) => (state.application_progress))

    return (
        // main container
        <div className="flex flex-col justify-center items-start gap-2 h-full w-full bg-white p-4">

            {/* personal info part */}
            <div className="flex justify-start items-center w-full h-fit gap-2">

                {/* number container */}
                <div className="flex justify-center items-center w-[10%] h-fit">

                    {Number(applicationProgress?.step) < 1 ? 
                        <span>1</span> : 
                        <div>
                            <Image 
                                src={GreenChecklist}
                                alt="Green checklist"
                                width={25}
                                height={25}
                            />
                        </div>
                    }
                    
                </div>

                {/* content container : title and caption */}
                <div className="flex flex-col justify-start items-center w-full h-fit">

                    {/* title */}
                    <div className="flex justify-start items-start font-bold text-md w-full h-fit">
                        Personal Info
                    </div>

                    {/* caption */}
                    <div className="flex justify-start items-start font-light text-sm w-full h-fit">
                        Basic Information
                    </div>

                </div>

            </div>

            {/* financial needs part */}
            <div className="flex justify-start items-center w-full h-fit gap-2">

                {/* number container */}
                <div className="flex justify-center items-center w-[10%] h-fit">

                    {Number(applicationProgress?.step) < 2 ? 
                        <span>2</span> : 
                        <div>
                            <Image 
                                src={GreenChecklist}
                                alt="Green checklist"
                                width={25}
                                height={25}
                            />
                        </div>
                    }
                    
                </div>

                {/* content container : title and caption */}
                <div className="flex flex-col justify-start items-center w-full h-fit">

                    {/* title */}
                    <div className="flex justify-start items-start font-bold text-md w-full h-fit">
                        Financial Needs
                    </div>

                    {/* caption */}
                    <div className="flex justify-start items-start font-light text-sm w-full h-fit">
                        Loan Details
                    </div>

                </div>

            </div>
            

            {/* personal info part */}
            <div className="flex justify-start items-center w-full h-fit gap-2">

                {/* number container */}
                <div className="flex justify-center items-center w-[10%] h-fit">

                    {Number(applicationProgress?.step) < 3 ? 
                        <span>3</span> : 
                        <div>
                            <Image 
                                src={GreenChecklist}
                                alt="Green checklist"
                                width={25}
                                height={25}
                            />
                        </div>
                    }
                    
                </div>

                {/* content container : title and caption */}
                <div className="flex flex-col justify-start items-center w-full h-fit">

                    {/* title */}
                    <div className="flex justify-start items-start font-bold text-md w-full h-fit">
                        Document Upload
                    </div>

                    {/* caption */}
                    <div className="flex justify-start items-start font-light text-sm w-full h-fit">
                        Required Documents
                    </div>

                </div>

            </div>
            

            {/* Agreement part */}
            <div className="flex justify-start items-center w-full h-fit gap-2">

                {/* number container */}
                <div className="flex justify-center items-center w-[10%] h-fit">

                    {Number(applicationProgress?.step) < 4 ? 
                        <span>4</span> : 
                        <div>
                            <Image 
                                src={GreenChecklist}
                                alt="Green checklist"
                                width={25}
                                height={25}
                            />
                        </div>
                    }
                    
                </div>

                {/* content container : title and caption */}
                <div className="flex flex-col justify-start items-center w-full h-fit">

                    {/* title */}
                    <div className="flex justify-start items-start font-bold text-md w-full h-fit">
                        Agreement
                    </div>

                    {/* caption */}
                    <div className="flex justify-start items-start font-light text-sm w-full h-fit">
                        Terms and Conditions
                    </div>

                </div>

            </div>

        </div>
    );
}