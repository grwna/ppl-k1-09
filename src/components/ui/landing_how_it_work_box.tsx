

export default function LandingHowItWorkBox(props : {number : string, title : string, caption : string}){

    return (
        <div>

            {/* number 1 */}
            <div>
                {props.number}
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