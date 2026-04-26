
import Image from "next/image";

export default function SummaryOfAspect(props : {title: string, value : any, logo : string, alt: string, update_caption : string, value_color : string, update_caption_color : string}) {

    // initialize 
    return (
        <div className="flex justify-between items-center bg-white p-2 rounded-2xl shadow-xl">
                    
            {/* left : title, values, and difference from histories */}
            <div className="font-sans">
                {/* title */}
                <div className="font-bold text-lg">
                    {props.title}
                </div>

                {/* value block */}
                <div className={`text-xl font-bold`}
                    style={{ color: `#${props.value_color}` }}
                >
                    {/* real value */}
                    <div>
                        {props.value}
                    </div>
                </div>

                {/* difference from histories */}
                <div className={`text-xs font-semibold`}
                    style={{ color: `#${props.update_caption_color}` }}
                >
                    {props.update_caption}
                </div>
            </div>

            {/* right : symbols */}
            <div className="flex justify-center items-start">
                <Image
                    src={props.logo}
                    alt={props.alt}
                    className="m-2"
                />
            </div>
        </div>
    );
}