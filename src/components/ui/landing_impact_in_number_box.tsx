
import Image from "next/image";
import localFont from "next/font/local";

// init fonts
const plusJakartaSansFont = localFont({
    src: "../../../public/fonts/PlusJakartaSans-VariableFont.ttf",
    display: 'swap',
});

export default function LandingImpactInNumberBox(props : {logo : string, alt : string, title: string, subtitle: string, caption : string}){
    return (
        <div className="bg-white/20 flex flex-col h-full w-[30%] justify-center items-center rounded-2xl">

            {/*  dollar sign */}
            <div className={`bg-white/20 w-[18%] h-[25%] rounded-full p-2 flex justify-center items-center`}>
                <Image 
                    src={props.logo}
                    alt={props.alt}
                />
            </div>

            {/* title */}
            <div className={`${plusJakartaSansFont.className} font-bold text-[48px] text-white w-full h-[20%] flex justify-center items-center`}>
                {props.title}
            </div>

            {/* subtitle */}
            <div className={`${plusJakartaSansFont.className} text-lg font-medium text-white flex justify-center items-center h-[20%] w-[80%]`}>
                {props.subtitle}
            </div>

            {/* caption */}
            <div className={`${plusJakartaSansFont.className} font-extralight text-white flex justify-center items-center text-center h-[20%] w-[80%]`}>
                {props.caption}
            </div>

        </div>
    );
}


