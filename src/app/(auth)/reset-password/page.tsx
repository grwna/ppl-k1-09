"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [tokenLoading, setTokenLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!token) {
            setTokenError("Token tidak ditemukan. Silakan ulangi proses lupa password.");
            setTokenLoading(false);
            return;
        }

        fetch(`/api/auth/reset-password?token=${token}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.email) {
                    setEmail(data.email);
                } else {
                    setTokenError(data.error || "Token tidak valid atau sudah kadaluarsa.");
                }
            })
            .catch(() => setTokenError("Terjadi kesalahan saat memvalidasi token."))
            .finally(() => setTokenLoading(false));
    }, [token]);

    const handleReset = async () => {
        setError(null);

        if (!password || !confirmPassword) {
            setError("Semua field wajib diisi.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Konfirmasi password tidak cocok.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password, confirmPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Gagal mereset password.");
                setLoading(false);
                return;
            }

            router.push("/login");
        } catch {
            setError("Terjadi kesalahan sistem.");
            setLoading(false);
        }
    };

    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );

    const EyeOffIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );

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

                    <div className="text-center">
                        <h1 className="text-lg font-bold">
                            Reset <span className="text-[#16C5DE]">Password</span>
                        </h1>
                    </div>

                    {tokenLoading && (
                        <div className="text-center text-gray-400 text-sm py-4">Memvalidasi token...</div>
                    )}

                    {tokenError && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">
                            {tokenError}
                            <div className="mt-3">
                                <a href="/forgot-password" className="text-[#16C5DE] underline">
                                    Kembali ke Lupa Password
                                </a>
                            </div>
                        </div>
                    )}

                    {!tokenLoading && !tokenError && (
                        <>
                            {/* email (read-only) */}
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">
                                    Email <span className="text-[#FF0000]">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="border border-black/20 bg-gray-50 p-3 rounded-xl w-full text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            {/* new password */}
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">
                                    Password <span className="text-[#FF0000]">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleReset()}
                                        className="border border-black/20 bg-white p-3 pr-11 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                                        placeholder="Masukkan Password Baru"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>

                            {/* confirm password */}
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">
                                    Konfirmasi Password <span className="text-[#FF0000]">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleReset()}
                                        className="border border-black/20 bg-white p-3 pr-11 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#16C5DE]"
                                        placeholder="Masukkan Kembali Password Baru"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="border border-[#16C5DE] h-12 w-full flex justify-center items-center rounded-full text-[#16C5DE] font-semibold hover:bg-[#16C5DE]/5 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Mereset..." : "Reset"}
                            </button>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
