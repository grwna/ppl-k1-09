
import Image from "next/image";

export default function DonorDashboard_SummaryOfDonor(props : {logo : string, alt : string, title : string, caption : string, color : string}) {

    // initialize variables
    
    return (
        // main container
        <div className=" flex flex-col items-center justify-start">
        
            {/* symbols */}
            <div className={`flex w-full h-20% justify-start items-center`}>
                <div className={`flex w-full h-full justify-center items-center rounded-full `}
                      style={{ backgroundColor: `#${props.color}20` }}>
                    <Image
                        src={props.logo}
                        alt={props.alt}
                        className="flex w-full h-full"
                    />
                </div>
            </div>

            {/* title */}
            <div>
                {props.title}
            </div>

            {/* caption */}
            <div>
                {props.caption}
            </div>

        </div>
    );
}