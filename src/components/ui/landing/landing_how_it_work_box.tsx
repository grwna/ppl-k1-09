export default function LandingHowItWorkBox(props : {color : string, number : string, title : string, caption : string}){

    return (
        <div className="w-full h-full flex flex-col justify-center items-start space-y-2 bg-white shadow p-10 rounded-2xl">

            {/* number 1 */}
            <div className={`bg-[${props.color}] flex justify-start items-center rounded-full w-fit h-[10%] px-4 py-2 font-bold text-white`}>
            {/* <div className={`bg-[#10B981] flex justify-start items-center rounded-full`}> */}
                {props.number}
            </div>

            {/* title */}
            <div className="text-lg h-[20%] w-full font-bold">
                {props.title}
            </div>

            {/* caption */}
            <div className="text-sm w-full h-[70%]">
                {props.caption}
            </div>

        </div>
    );
}