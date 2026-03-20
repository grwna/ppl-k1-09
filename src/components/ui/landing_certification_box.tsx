
import Image from "next/image";
import localFont from "next/font/local";

const plusJakartaSansFont = localFont({
    src: "../../../public/fonts/PlusJakartaSans-VariableFont.ttf",
    display: 'swap',
});

export default function LandingCertificationBox(props : {logo : string, alt: string, caption : string}) {

    return (
        <div className="flex justify-center items-center border border-gray-400 rounded-2xl p-2">
            
            <div className="flex w-[10%] h-full items-center justify-center">
                <Image 
                    src={props.logo}
                    alt={props.alt}
                    width={10}
                    height={10}
                />
            </div>

            <div className={`${plusJakartaSansFont.className} flex w-[95%] h-full justify-center items-center text-sm text-center`}>
                {props.caption}
            </div>

        </div>
    );
}