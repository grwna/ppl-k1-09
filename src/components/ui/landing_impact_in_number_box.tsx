
import Image from "next/image";
import localFont from "next/font/local";

// init fonts
const plusJakartaSansFont = localFont({
    src: "../../../public/fonts/PlusJakartaSans-VariableFont.ttf",
    display: 'swap',
});

export default function LandingImpactInNumberBox(props : {logo : string, alt : string, title: string, subtitle: string, caption : string}){
    return (
        <div>

            {/*  dollar sign */}
            <div>
            <Image 
                src={props.logo}
                alt={props.alt}
            />
            </div>

            {/* title */}
            <div className={`${plusJakartaSansFont.className} font-bold text-4xl`}>
            {props.title}
            </div>

            {/* subtitle */}
            <div>
            {props.subtitle}
            </div>

            {/* caption */}
            <div>
            {props.caption}
            </div>

        </div>
    );
}


