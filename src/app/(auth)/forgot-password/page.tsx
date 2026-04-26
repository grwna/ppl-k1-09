"use client"

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const RESEND_COOLDOWN = 60;

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [sent, setSent] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startCountdown = () => {
        setCountdown(RESEND_COOLDOWN);
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSend = async () => {
        setError(null);

        if (!email) {
            setError("Email wajib diisi.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Gagal mengirim email.");
                setLoading(false);
                return;
            }

            setSent(true);
            startCountdown();
        } catch {
            setError("Terjadi kesalahan sistem.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setSent(false);
        await handleSend();
    };

    return (
        <div className="font-sans flex flex-col w-full min-h-screen overflow-hidden items-center justify-center relative">
            <Image
                src="/auth-bg.svg"
                alt=""
                fill
                className="object-cover -z-10"
                priority
            />

            {/* logo */}
            <div className="flex relative w-full justify-center items-center h-[30%] mb-8">
                <Image
                    src="/rumah-amal-logo.svg"
                    alt="Logo Rumah Amal Salman"
                    width={200}
                    height={100}
                    priority
                />
            </div>

            {/* card */}
            <div className="flex w-full justify-center items-center px-4">
                <div className="border border-black/20 bg-white p-8 w-full max-w-md rounded-2xl shadow-2xl flex flex-col gap-6">

                    {/* title */}
                    <div className="text-center">
                        <h1 className="text-lg font-bold">
                            Lupa <span className="text-[#16C5DE]">Password</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Masukkan email Anda untuk menerima link reset password
                        </p>
                    </div>

                    {/* email field */}
                    <div className="flex flex-col gap-2">
                        <label className="font-medium">
                            Email <span className="text-[#FF0000]">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                            className="border border-black/20 bg-white p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                            placeholder="Masukkan Email"
                            disabled={loading}
                        />
                        <div className="flex justify-end">
                            <Link href="/login" className="text-xs text-gray-500 hover:text-[#16C5DE]">
                                Sudah Ingat Password? <span className="text-[#16C5DE] font-semibold">Log In</span>
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* verify button */}
                    <button
                        onClick={handleSend}
                        disabled={loading || countdown > 0}
                        className="bg-[#16C5DE] h-12 w-full flex justify-center items-center rounded-full text-white font-bold hover:bg-[#13A6BB] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Mengirim..." : "Verifikasi"}
                    </button>

                    {/* resend */}
                    <div className="text-sm text-center text-gray-500">
                        Tidak mendapat email?{" "}
                        <button
                            onClick={handleResend}
                            disabled={countdown > 0 || loading}
                            className="text-[#16C5DE] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
                        >
                            Kirim Ulang
                        </button>
                        {countdown > 0 && (
                            <span className="block text-gray-400 text-xs mt-1">{countdown}s</span>
                        )}
                    </div>

                    {/* terms */}
                    <div className="text-xs text-center text-black/40 leading-relaxed">
                        Dengan log in, kamu menyetujui{" "}
                        <span className="underline">Kebijakan Privasi</span> dan{" "}
                        <span className="underline">Syarat & Ketentuan</span> Rumah Amal Salman
                    </div>

                </div>
            </div>
        </div>
    );
}
