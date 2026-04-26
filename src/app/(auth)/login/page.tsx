"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    // init variables
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false);
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
                const session = await getSession();
                const roles = ((session?.user as { roles?: string[] })?.roles || []) as string[];

                if (roles.includes("DONOR")) {
                    router.push("/donor/dashboard");
                } else if (roles.includes("ADMIN")) {
                    router.push("/admin/dashboard");
                } else if (roles.includes("BORROWER")) {
                    router.push("/applicant/dashboard");
                } else {
                    router.push("/donor/dashboard");
                }

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
        <div className="font-sans flex flex-col w-full min-h-screen overflow-hidden items-center justify-center relative">
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
                        <div className="text-lg font-bold">
                            Selamat Datang di <span className="text-[#16C5DE]">Rumah Amal Salman!</span>
                        </div>

                        {/* sub greeting container */}
                        <div className="text-sm text-gray-500" >
                            Log In untuk melanjutkan
                        </div>

                    </div>


                    {/* email container */}
                    <div className="flex flex-col gap-2">
                        <label className="font-medium">
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
                        <label className="font-medium">
                            Password <span className="text-[#FF0000]">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                className="border border-black/20 bg-white p-3 pr-11 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                                placeholder="Masukkan Password..."
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="flex justify-end mt-1">
                            <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-[#16C5DE] underline underline-offset-2">
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
                            className="border-[#16C5DE] border flex-1 h-12 flex justify-center items-center rounded-xl text-[#16C5DE] hover:bg-[#16C5DE]/5 transition-colors"
                        >
                            Sign Up
                        </Link>

                        {/* log in button */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="bg-[#16C5DE] flex-1 h-12 flex justify-center items-center rounded-xl text-white hover:bg-[#13A6BB] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Loading..." : "Log In"}
                        </button>

                    </div>

                    {/* minimal caption */}
                    <div className="text-xs text-center text-black/40 mt-4 leading-relaxed">
                        Dengan log in, kamu menyetujui Kebijakan Privasi dan Syarat & Ketentuan Rumah Amal Salman
                    </div>

                </div>
                
            </div>

        </div>
    );
}
