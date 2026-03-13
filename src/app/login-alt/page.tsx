
import Link from "next/link";
import Image from "next/image";
import RumahAmalLogo from "../../../public/rumah-amal-logo.svg"
import { useState } from "react";

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
        <div className="w-full h-full block">

            {/* rumah amal salman logo */}
            <div className="flex w-full justify-center items-center h-[30%]">
                {/* <div> */}
                    <Image
                        src={RumahAmalLogo}
                        alt="Logo Rumah Amal Salman"
                    />
                {/* </div> */}
            </div>

            {/* login container */}
            <div>

                {/* greeting container */}
                <div>
                    {/* greeting caption container */}
                    <div>
                        Selamat Datang di <span className="text-[#16C5DE]">Rumah Amal Salman!</span>
                    </div>

                    {/* sub greeting container */}
                    <div>
                        Log In untuk melanjutkan
                    </div>

                </div>


                {/* email container */}
                <div>

                    {/* email prompt container */}
                    <div>
                        Email <span className="text-[#FF0000]">*</span>
                    </div>

                    {/* email textbox container */}
                    <div className="p-4 border-t bg-white flex gap-2">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter"}
                            className="flex-1 border p-2 rounded"
                            placeholder="Masukkan Email..."
                        />
                        {/* <button
                            onClick={() => submitActions()}
                            className="bg-green-500 px-4 rounded"
                        >
                            Send
                        </button> */}
                    </div>

                </div>

                {/* password container */}
                <div>

                    {/* email prompt container */}
                    <div>
                        Password <span className="text-[#FF0000]">*</span>
                    </div>

                    {/* email textbox container */}
                    <div className="p-4 border-t bg-white flex gap-2">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter"}
                            className="flex-1 border p-2 rounded"
                            placeholder="Masukkan Password..."
                        />
                    </div>

                    {/* `lupa password?` container */}
                    <div>
                        <Link href="/not-found" className="underline-offset-2">Lupa Password</Link>
                    </div>

                </div>

                {/* submit buttons container */}
                <div>

                    {/* sign up container */}
                    <div>
                        <button
                            onClick={() => submitActions()}
                            className="bg-green-500 px-4 rounded"
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* log in cntainer */}
                    <div>
                        <button
                            onClick={() => submitActions()}
                            className="bg-green-500 px-4 rounded"
                        >
                            Log In
                        </button>
                    </div>

                </div>

                {/* minimal caption */}
                <div>
                    Dengan log in, kamu menyetujui Kebijakan Privasi dan Syarat & Ketentuan Rumah Amal Salman
                </div>

            </div>

        </div>
    );
}