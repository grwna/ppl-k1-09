"use client"

import Link from "next/link";
import Image from "next/image";
import { Plus_Jakarta_Sans } from 'next/font/google'
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// init fonts
const plusJakartaSansFont = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-plus-jakarta-sans',
});

export default function LoginPage() {
    const router = useRouter();

    // init variables
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // function for login action
    const handleLogin = async () => {
        setError(null);
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Email atau password salah.");
                setLoading(false);
            } else {
                router.push("/logged-in");
                router.refresh();
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Terjadi kesalahan saat login.");
            setLoading(false);
        }
    };

    return (
        // main container
        <div className={`${plusJakartaSansFont.variable} font-sans flex flex-col w-full min-h-screen overflow-hidden items-center justify-center relative`}>
            <Image
                src="/auth-bg.svg"
                alt=""
                fill
                className="object-cover -z-10"
                priority
            />

            {/* rumah amal salman logo */}
            <div className="flex relative w-full justify-center items-center h-[30%] mb-8">
                    <Image
                        src="/rumah-amal-logo.svg"
                        alt="Logo Rumah Amal Salman"
                        width={200}
                        height={100}
                        priority
                    />
            </div>

            {/* login container */}
            <div className="flex w-full justify-center items-center px-4">

                <div className="border border-black/20 bg-white p-8 w-full max-w-md rounded-2xl shadow-2xl flex flex-col gap-6">

                    {/* greeting container */}
                    <div className="grid justify-center items-center gap-y-2 text-center">
                        {/* greeting caption container */}
                        <div className={`${plusJakartaSansFont.className} text-lg font-bold`}>
                            Selamat Datang di <span className="text-[#16C5DE]">Rumah Amal Salman!</span>
                        </div>

                        {/* sub greeting container */}
                        <div className={`${plusJakartaSansFont.className} text-sm text-gray-500`} >
                            Log In untuk melanjutkan
                        </div>

                    </div>


                    {/* email container */}
                    <div className="flex flex-col gap-2">
                        <label className={`${plusJakartaSansFont.className} font-medium`}>
                            Email <span className="text-[#FF0000]">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className="border border-black/20 bg-white p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                            placeholder="Masukkan Email..."
                            disabled={loading}
                        />
                    </div>

                    {/* password container */}
                    <div className="flex flex-col gap-2">
                        <label className={`${plusJakartaSansFont.className} font-medium`}>
                            Password <span className="text-[#FF0000]">*</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className="border border-black/20 bg-white p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                            placeholder="Masukkan Password..."
                            disabled={loading}
                        />
                        <div className="flex justify-end mt-1">
                            <Link href="/not-found" className="text-xs text-gray-500 hover:text-[#16C5DE] underline underline-offset-2">
                                Lupa Password?
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* submit buttons container */}
                    <div className="flex items-center justify-between gap-4 mt-2">

                        {/* sign up button */}
                        <Link
                            href="/sign-up"
                            className={`border-[#16C5DE] border flex-1 h-12 flex justify-center items-center rounded-xl text-[#16C5DE] hover:bg-[#16C5DE]/5 transition-colors ${plusJakartaSansFont.className}`}
                        >
                            Sign Up
                        </Link>

                        {/* log in button */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className={`bg-[#16C5DE] flex-1 h-12 flex justify-center items-center rounded-xl text-white hover:bg-[#13A6BB] transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${plusJakartaSansFont.className}`}
                        >
                            {loading ? "Loading..." : "Log In"}
                        </button>

                    </div>

                    {/* minimal caption */}
                    <div className={`${plusJakartaSansFont.className} text-xs text-center text-black/40 mt-4 leading-relaxed`}>
                        Dengan log in, kamu menyetujui Kebijakan Privasi dan Syarat & Ketentuan Rumah Amal Salman
                    </div>

                </div>
                
            </div>

        </div>
    );
}
