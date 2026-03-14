"use client"

import Link from "next/link";
import Image from "next/image";
import { Plus_Jakarta_Sans } from 'next/font/google'
import { useState } from "react";
import { useRouter } from "next/navigation";

// init fonts
const plusJakartaSansFont = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-plus-jakarta-sans',
});

export default function SignUpPage() {
    const router = useRouter();

    // init variables
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmedPassword, setConfirmedPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // functions for submit actions
    const handleRegister = async () => {
        setError(null);

        if (!email || !password || !confirmedPassword) {
            setError("Semua field harus diisi.");
            return;
        }

        if (password !== confirmedPassword) {
            setError("Konfirmasi password tidak cocok.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email, 
                    password,
                    name: email.split('@')[0], // Default name from email part
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registrasi gagal.");
                setLoading(false);
            } else {
                // Success, redirect to login
                router.push("/login");
            }
        } catch (err) {
            console.error("Register error:", err);
            setError("Terjadi kesalahan sistem.");
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
                            Daftar akun baru
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
                            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
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
                            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                            className="border border-black/20 bg-white p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                            placeholder="Masukkan Password..."
                            disabled={loading}
                        />
                    </div>

                    {/* confirmed password container */}
                    <div className="flex flex-col gap-2">
                        <label className={`${plusJakartaSansFont.className} font-medium`}>
                            Konfirmasi Password <span className="text-[#FF0000]">*</span>
                        </label>
                        <input
                            type="password"
                            value={confirmedPassword}
                            onChange={(e) => setConfirmedPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                            className="border border-black/20 bg-white p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                            placeholder="Ulangi Password..."
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* submit buttons container */}
                    <div className="flex items-center justify-center w-full gap-x-2 mt-2">

                        {/* sign up container */}
                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className={`bg-[#16C5DE] flex-1 h-12 flex justify-center items-center rounded-xl text-white font-bold hover:bg-[#13A6BB] transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${plusJakartaSansFont.className}`}
                        >
                            {loading ? "Loading..." : "Sign Up"}
                        </button>

                    </div>

                    {/* minimal caption */}
                    <div className={`${plusJakartaSansFont.className} text-xs flex items-center justify-center text-black/40 text-center mt-4`}>
                        Sudah Punya Akun? <Link href="/login" className="text-[#16C5DE] font-bold underline ml-1">Log In</Link>
                    </div>

                </div>
                
            </div>

        </div>
    );
}