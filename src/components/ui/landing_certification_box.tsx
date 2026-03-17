
import Image from "next/image";

export default function LandingCertificationBox(props : {logo : string, alt: string, caption : string}) {

    return (
        <div className="flex justify-center items-center border border-gray-400 rounded-2xl p-2">
            
            <div className="flex w-[10%] h-full items-center justify-center">
                <Image 
                    src={props.logo}
                    alt={props.alt}
                />
            </div>

            <div className="flex w-[90%] h-full justify-center items-center text-sm">
                {props.caption}
            </div>

        </div>
    );
}