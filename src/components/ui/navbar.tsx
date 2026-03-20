// NOTE : 
/**
 * buat sprint > 1, navigation 
 */

"use client"

import { useState } from "react"
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

import RumahAmalHorizontalLogo from "../../../public/rumah-amal-horizontal-logo.svg"

// init fonts
const plusJakartaSansFont = localFont({
    src: "../../../public/fonts/PlusJakartaSans-VariableFont.ttf",
    display: 'swap',
});

export default function NavigationBar() {
    // init variables
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    return (

        // main container
        <div className="flex justify-between items-center h-[10%] p-2">

            {/* rumah amal salman logo */}
            <div className="flex relative w-[10%] justify-center items-center">
                <Image
                    src={RumahAmalHorizontalLogo}
                    alt="Logo Rumah Amal Salman"
                    width={100}
                    height={100}
                />
            </div>

            {/* navigations */}
            <div className="flex gap-x-10 w-[70%] justify-center items-center">

                {/* Home */}
                <div className={`${plusJakartaSansFont.className} font-bold`}>
                    <Link href={'/dashboard/example'}>Home</Link>
                </div>

                {/* programs */}
                <div className={`${plusJakartaSansFont.className} font-bold`}>
                    <Link href={'/not-found'}>Programs</Link>
                </div>

                {/* FAQ */}
                <div className={`${plusJakartaSansFont.className} font-bold`}>
                    <Link href={'/not-found'}>FAQ</Link>
                </div>

            </div>

            {/* login + register */}
            <div className="flex w-[15%] justify-around items-center">

                {/* login */}
                <div className={`${plusJakartaSansFont.className} font-bold `}>
                    Login
                </div>

                {/* register */}
                <div className={`${plusJakartaSansFont.className} text-white font-bold bg-[#16C5DE] px-4 py-2 rounded-2xl`}>
                    Register
                </div>

            </div>

        </div>
    );
}