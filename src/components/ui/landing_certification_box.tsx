
import Image from "next/image";

export default function LandingCertificationBox(props : {logo : string, alt: string, caption : string}) {

    return (
        <div className="flex justify-center items-center">
            
            <div className="flex w-[25%] h-full items-center justify-center">
                <Image 
                    src={props.logo}
                    alt={props.alt}
                />
            </div>

            <div className="flex w-[75%] h-full justify-center items-center">
                {props.caption}
            </div>
            
        </div>
    );
}