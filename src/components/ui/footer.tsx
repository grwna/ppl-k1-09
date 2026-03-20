
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";

import RumahAmalSalmanHorizontalLogo from "../../../public/rumah-amal-horizontal-logo.svg"
import MailSign from "../../../public/mail.svg"
import LocationSign from "../../../public/location.svg"
import PhoneSign from "../../../public/phone.svg"


// init fonts
const plusJakartaSansFont = localFont({
    src: "../../../public/fonts/PlusJakartaSans-VariableFont.ttf",
    display: 'swap',
});

export default function Footer(){

    // init variables

    return (

        // main container
        <div className="relative w-full h-[30%] flex flex-col justify-center items-center bg-[#262626] px-4">

            {/* grid container for credentials (not included copyrights) */}
            <div className="relative w-full h-[75%] flex justify-center items-center pt-4 pb-10">

                {/* grid container that contain the credential of rumah amal salman */}
                <div className="grid grid-cols-4 justify-center items-start gap-y-4 p-2">

                    {/* rumah amal salman information */}
                    <div className="flex justify-center items-center">

                        <div className="grid grid-rows-2 justify-start items-start ">

                            {/* rumah amal salman horizontal information */}
                            <div className="flex justify-start items-start">
                                <Image 
                                    src={RumahAmalSalmanHorizontalLogo}
                                    alt="Rumah Amal Salman Horizontal Logo"
                                />
                            </div>
                            
                            {/* caption */}
                            <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px] flex justify-start items-start`}>
                                An ethical, interest-free student loan management system by Rumah Amal Salman. Empowering education through Islamic philanthropy.
                            </div>

                        </div>
                    </div>

                    {/* quick links */}
                    <div className="flex flex-col justify-center items-start">

                        {/* grid of quick links */}
                        <div className="grid grid-rows-5 gap-y-2">

                            {/* title */}
                            <div className={`${plusJakartaSansFont.className} text-white font-bold text-[14px]`}>
                                Quick Links
                            </div>

                            {/* home */}
                            <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                <Link href={"/not-found"}>Home</Link>
                            </div>

                            {/* programs */}
                            <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                <Link href={"/not-found"}>Programs</Link>
                            </div>

                            {/* FAQ */}
                            <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                <Link href={"/not-found"}>FAQ</Link>
                            </div>

                            {/* About us */}
                            <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                <Link href={"/not-found"}>About Us</Link>
                            </div>

                        </div>


                    </div>

                    {/* resources */}
                    <div className="flex flex-col justify-center items-start">


                        {/* grid of quick links */}
                        <div className="grid grid-rows-5 gap-y-2">

                            {/* title */}
                            <div className={`${plusJakartaSansFont.className} text-white font-bold text-[14px]`}>
                                Resources
                            </div>

                            {/* Transparency Report */}
                            <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                <Link href={"/not-found"}>Transparency Report</Link>
                            </div>

                            {/* Annual Report */}
                            <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                <Link href={"/not-found"}>Annual Report</Link>
                            </div>

                            {/* Privacy Policy */}
                            <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                <Link href={"/not-found"}>Privacy Policy</Link>
                            </div>

                            {/* Terms of Service */}
                            <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                <Link href={"/not-found"}>Terms of Service</Link>
                            </div>

                        </div>

                    </div>

                    {/* contact us */}
                    <div className="flex flex-col justify-start items-start">

                        {/* contents */}
                        <div className="grid grid-rows-4 gap-y-2">

                            {/* title */}
                            <div className={`${plusJakartaSansFont.className} text-white font-bold text-[14px]`}>
                                Contact Us
                            </div>

                            {/* email */}
                            <div className="flex justify-start items-start">
                                {/* logo */}
                                <div className="flex justify-center items-start">
                                    <Image 
                                        src={MailSign}
                                        alt="Mail sign"
                                    />
                                </div>

                                {/* caption */}
                                <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                    info@rumahamal.org
                                </div>
                            </div>

                            {/* phone number */}
                            <div className="flex justify-start items-start">
                                {/* logo */}
                                <div className="flex justify-center items-center">
                                    <Image 
                                        src={PhoneSign}
                                        alt="Phone sign"
                                    />
                                </div>

                                {/* caption */}
                                <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                    +62 812 3456 7890
                                </div>
                            </div>

                            {/* location */}
                            <div className="flex justify-start items-start">
                                {/* logo */}
                                <div className="flex justify-center items-center">
                                    <Image 
                                        src={LocationSign}
                                        alt="Location sign"
                                    />
                                </div>

                                {/* caption */}
                                <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                                    Bandung, West Java, Indonesia
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* separator */}
            <div className="w-full h-0.5 bg-gray-300"/>

            {/* copyrights + privacy, terms, cookies */}
            <div className="flex justify-between items-center w-full h-[10%] p-2">

                {/* copyrights */}
                <div className={`${plusJakartaSansFont.className} flex justify-start items-center w-[85%] h-full text-white font-extralight text-[14px]`}>
                    © 2026 RAS1 - Rumah Amal Salman. All rights reserved.
                </div>

                {/* privacy, terms, cookies */}
                <div className="flex justify-between items-center w-[15%] h-full ">

                    {/* privacy */}
                    <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                        <Link href={"/not-found"}>Privacy</Link>
                    </div>

                    {/* terms */}
                    <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                        <Link href={"/not-found"}>Terms</Link>
                    </div>

                    {/* cookies */}
                    <div className={`${plusJakartaSansFont.className} text-white font-extralight text-[14px]`}>
                        <Link href={"/not-found"}>Cookies</Link>
                    </div>

                </div>

            </div>
        </div>
        
    );
}