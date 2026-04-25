

import Image from "next/image";
import localFont from "next/font/local";

const plusJakartaSansFont = localFont({
    src: "../../../public/fonts/PlusJakartaSans-VariableFont.ttf",
    display: 'swap',
});

export default function LandingTrustTransparencyBox(props : {logo : string, alt : string, title : string, caption : string}) {

    return (
        <div className="w-full h-full flex justify-start items-center bg-white shadow-lg p-2 rounded-2xl">

            {/* logo */}
            <div className={`w-[10%] h-fit flex justify-center items-center ${plusJakartaSansFont.className} bg-[#07B0C8]/6 rounded-full p-2 `}>
                <Image
                    src={props.logo}
                    alt={props.alt}
                />
            </div>

            {/* title + caption container */}
            <div className="flex flex-col justify-center items-start p-2">

                {/* title */}
                <div className={`${plusJakartaSansFont.className} font-bold text-[16px] `}>
                    {props.title}
                </div>

                {/* caption */}
                <div className={`${plusJakartaSansFont.className} font-light text-sm text-gray-500`}>
                    {props.caption}
                </div>

            </div>

        </div>
    );
}


