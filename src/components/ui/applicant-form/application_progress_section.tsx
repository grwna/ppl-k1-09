
import Image from "next/image";

import GreenChecklist from  "../../../../public/green-checklist.svg"

import { useApplicationProgressStore } from "@/hooks/applicationProgressStore";


export default function ApplicantForm_ApplicationProgressSection() {

    const applicationProgress = useApplicationProgressStore((state) => (state.application_progress))

    return (
        // main container
        <div>

            {/* personal info part */}
            {Number(applicationProgress?.step) > 1 &&
                <div>

                    {/* number container */}
                    <div>

                        {Number(applicationProgress?.step) > 1 ? 
                            <span>1</span> : 
                            <div>
                                <Image 
                                    src={GreenChecklist}
                                    alt="Green checklist"
                                />
                            </div>
                        }
                        
                    </div>

                    {/* content container : title and caption */}
                    <div>

                        {/* title */}
                        <div>
                            Personal Info
                        </div>

                        {/* caption */}
                        <div>
                            Basic Information
                        </div>

                    </div>

                </div>
            }

            

            {/* financial needs part */}
            {Number(applicationProgress?.step) > 2 &&
                <div>

                    {/* number container */}
                    <div>

                        {Number(applicationProgress?.step) > 2 ? 
                            <span>2</span> : 
                            <div>
                                <Image 
                                    src={GreenChecklist}
                                    alt="Green checklist"
                                />
                            </div>
                        }
                        
                    </div>

                    {/* content container : title and caption */}
                    <div>

                        {/* title */}
                        <div>
                            Financial Needs
                        </div>

                        {/* caption */}
                        <div>
                            Loan details
                        </div>

                    </div>

                </div>
            }

            

            {/* personal info part */}
            {Number(applicationProgress?.step) > 3 &&
                <div>

                    {/* number container */}
                    <div>

                        {Number(applicationProgress?.step) > 3 ? 
                            <span>3</span> : 
                            <div>
                                <Image 
                                    src={GreenChecklist}
                                    alt="Green checklist"
                                />
                            </div>
                        }
                        
                    </div>

                    {/* content container : title and caption */}
                    <div>

                        {/* title */}
                        <div>
                            Document Upload
                        </div>

                        {/* caption */}
                        <div>
                            Required documents
                        </div>

                    </div>

                </div>
            }

            

            {/* Agreement part */}
            {Number(applicationProgress?.step) > 4 &&
                <div>

                    {/* number container */}
                    <div>

                        {Number(applicationProgress?.step) > 4 ? 
                            <span>4</span> : 
                            <div>
                                <Image 
                                    src={GreenChecklist}
                                    alt="Green checklist"
                                />
                            </div>
                        }
                        
                    </div>

                    {/* content container : title and caption */}
                    <div>

                        {/* title */}
                        <div>
                            Agreement
                        </div>

                        {/* caption */}
                        <div>
                            Terms and conditions
                        </div>

                    </div>

                </div>
            }

        </div>
    );
}