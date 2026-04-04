
import Image from "next/image";

export default function SummaryOfAspect(props : {title: string, value : string, logo : string, alt: string, update_caption : string}) {

    // initialize 
    return (
        <div className="flex justify-between items-center">
                    
            {/* left : title, values, and difference from histories */}
            <div>
                {/* title */}
                <div>
                    {props.title}
                </div>

                {/* value block */}
                <div>
                    {/* real value */}
                    <div>
                        {props.value}
                    </div>
                </div>

                {/* difference from histories */}
                <div>
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