"use client"

import Link from "next/link";
import Image from "next/image";
import { Plus_Jakarta_Sans } from 'next/font/google'
import { useState } from "react";

// init fonts
const plusJakartaSansFont = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-plus-jakarta-sans',
});

export default function LoginPage() {


    // init variables (call for other api)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    // functions for submit actions
    const submitActions = async () => {
        // initinya ini bakal submit actions
        console.log("Submit action activated!..")
    }

    return (
        // main container
        <div className={`${plusJakartaSansFont.variable} font-sans flex-col w-full min-h-screen block overflow-hidden items-center justify-center`}>
            <Image
                src="/auth-bg.svg"
                alt=""
                fill
                className="object-cover -z-10"
            />

            {/* rumah amal salman logo */}
            <div className="flex relative w-full justify-center items-center h-[30%]">
                    <Image
                        src="/rumah-amal-logo.svg"
                        alt="Logo Rumah Amal Salman"
                        width={200}
                        height={100}
                    />
            </div>

            {/* login container */}
            <div className="flex w-full h-[40%] justify-center items-center">

                <div className="border border-black/20 bg-white p-4 w-[30%] h-[40%] rounded-2xl shadow-2xl">

                    {/* greeting container */}
                    <div className="grid justify-center items-center gap-y-2">
                        {/* greeting caption container */}
                        <div className={`${plusJakartaSansFont.className} flex justify-center items-center text-lg font-bold`}>
                            Selamat Datang di <span className="text-[#16C5DE]">Rumah Amal Salman!</span>
                        </div>

                        {/* sub greeting container */}
                        <div className={`${plusJakartaSansFont.className} flex justify-center items-center text-sm`} >
                            Log In untuk melanjutkan
                        </div>

                    </div>


                    {/* email container */}
                    <div>

                        {/* email prompt container */}
                        <div className={`${plusJakartaSansFont.className} flex py-2`} >
                            Email <span className="text-[#FF0000]">*</span>
                        </div>

                        {/* email textbox container */}
                        <div className="flex w-full h-full">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter"}
                                className="flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl"
                                placeholder="Masukkan Email..."
                            />
                        </div>

                    </div>

                    {/* password container */}
                    <div>

                        {/* password prompt container */}
                        <div className={`${plusJakartaSansFont.className} flex py-2`} >
                            Password <span className="text-[#FF0000]">*</span>
                        </div>

                        {/* password textbox container */}
                        <div className="flex w-full h-full">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter"}
                                className="flex gap-2 border border-black/20 bg-white p-4 w-full h-[40%] rounded-2xl shadow-2xl"
                                placeholder="Masukkan Password..."
                            />
                        </div>

                        {/* `lupa password?` container */}
                        <div className="flex w-full h-full justify-end items-center text-xs py-2 underline">
                            <Link href="/not-found" className="underline-offset-2">Lupa Password?</Link>
                        </div>

                    </div>

                    {/* submit buttons container */}
                    <div className="flex items-center justify-center w-full h-full gap-x-2 py-2">

                        {/* sign up container */}
                        <button
                            onClick={() => submitActions()}
                            className={`border-[#16C5DE] border flex w-[40%] h-full justify-center items-center rounded-2xl p-1 text-[#16C5DE] ${plusJakartaSansFont.className}`}
                        >
                            Sign Up
                        </button>

                        {/* log in cntainer */}
                        <button
                            onClick={() => submitActions()}
                            className={`bg-[#16C5DE] border flex w-[40%] h-full justify-center items-center rounded-2xl p-1 text-white ${plusJakartaSansFont.className}`}
                        >
                            Log In
                        </button>

                    </div>

                    {/* minimal caption */}
                    <div className={`${plusJakartaSansFont.className} text-xs flex items-center justify-center text-black/40 text-center`}>
                        Dengan log in, kamu menyetujui Kebijakan Privasi dan Syarat & Ketentuan Rumah Amal Salman
                    </div>

                </div>
                
            </div>

        </div>
    );
}
