

import Image from "next/image";

export default function LandingTrustTransparencyBox(props : {logo : string, alt : string, title : string, caption : string}) {

    return (
        <div className="flex justify-start items-center">

            {/* logo */}
            <div>
                <Image
                    src={props.logo}
                    alt={props.alt}
                />
            </div>

            {/* title + caption container */}
            <div>

                {/* title */}
                <div>
                    {props.title}
                </div>

                {/* caption */}
                <div>
                    {props.caption}
                </div>

            </div>

        </div>
    );
}


