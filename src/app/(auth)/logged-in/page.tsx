"use client"

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function LoggedInPage() {
    const { data: session, status } = useSession();

    if (status === "loading") return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="flex flex-col w-full min-h-screen items-center justify-center p-4">
             <Image
                src="/auth-bg.svg"
                alt=""
                fill
                className="object-cover -z-10"
            />
            
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-black/10 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4 text-[#16C5DE]">Login Berhasil!</h1>
                
                <div className="space-y-4 text-left border-t border-b py-4 my-4">
                    <p><strong>Nama:</strong> {session?.user?.name || "N/A"}</p>
                    <p><strong>Email:</strong> {session?.user?.email}</p>
                    <p><strong>Roles:</strong> {(session?.user as any)?.roles?.join(", ") || "No Roles Assigned"}</p>
                </div>

                <button 
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full bg-red-500 text-white rounded-xl p-2 hover:bg-red-600 transition"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}
