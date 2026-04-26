
"use client"

import { useState } from "react"
import Image from "next/image"

import { useUserStore } from "@/hooks/userStore"
import GreenChecklistLogo from "../../../../public/green-checklist.svg"
import AlertLogo from "../../../../public/alert.svg"
import GrayDotLogo from "../../../../public/gray-dot.svg"

export default function ApplicantDashboard_PaymentScheduleRow(props : {installment_value : number, installment_date : Date, installment_order : number, installment_status : string}){

    // fetch conditions from the db
    const installmentStatusColor : any = {
        "paid" : {
            "bg-hex" : "D0FAE5",
            "text-hex" : "006045",
            "logo" : GreenChecklistLogo,
            "alt" : "Green checklist logo"
        },
        "due_soon" : {
            "bg-hex" : "FEF9C2",
            "text-hex" : "894B00",
            "logo" : AlertLogo,
            "alt" : "Alert logo"
        },
        "pending" : {
            "bg-hex" : "F3F4F6",
            "text-hex" : "1E2939",
            "logo" : GrayDotLogo,
            "alt" : "Gray dot logo"
        }
    }

    return (

        // main container
        <div className="flex justify-center items-center h-full w-full">
            
            {/* symbol */}
            <div className={`flex justify-start items-start rounded-full h-full p-2`}
                // style={{ background : `#${installmentStatusColor[props.installment_status]['bg-hex']}`}}
            >
                <Image
                    src={installmentStatusColor[props.installment_status]["logo"]}
                    alt={installmentStatusColor[props.installment_status]["alt"]}
                    width={20}
                    height={20}
                    className="rounded-2xl w-full h-fit justify-center items-start p-2"
                    style={{ background : `#${installmentStatusColor[props.installment_status]['bg-hex']}`}}
                />
            </div>

            {/* content : date, installment, and status */}
            <div className="flex flex-col h-fit w-[65%] p-2">

                {/* date */}
                <div className="flex justify-start items-start p-0.5">
                    {props.installment_date.toDateString()}
                </div>

                {/* installment */}
                <div className="flex justify-start items-start p-0.5">
                    Cicilan #{props.installment_order}
                </div>

                {/* status */}
                <div className={`flex w-fit rounded-2xl p-2 justify-start items-start font-semibold text-sm`}
                    style={{ background : `#${installmentStatusColor[props.installment_status]['bg-hex']}` ,
                            color : `#${installmentStatusColor[props.installment_status]['text-hex']}`
                    }}
                >
                    {props.installment_status}
                </div>

            </div>

            {/* value of payment */}
            <div className="flex h-fit w-[25%] justify-end items-center">
                Rp {props.installment_value.toString()}
            </div>

        </div>
    );
}