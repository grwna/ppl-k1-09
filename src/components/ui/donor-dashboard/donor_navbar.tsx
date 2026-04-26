
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useMemo } from "react";
import { ChevronDown } from "lucide-react";

import RumahAmalHorizontalLogo from "../../../../public/rumah-amal-horizontal-logo.svg"
import UserPersonaLogo from "../../../../public/user_persona.svg"

import { useUserStore } from "@/hooks/userStore";

export default function DonorDashboard_DonorNavbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const usernameFromStore = useUserStore((state) => (state.user?.username));
    const username = useMemo(() => {
        const fallback = session?.user?.name || "Donor";
        return usernameFromStore || fallback;
    }, [session?.user?.name, usernameFromStore]);

    const menuItems = [
        { href: "/donor/dashboard", label: "Dashboard" },
        { href: "/donor/donate-form", label: "Donate" },
        { href: "/not-found", label: "History" },
        { href: "/not-found", label: "Report" },
    ];
    
    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex justify-between items-center h-[58px]">
                    <div className="flex-shrink-0">
                        <Link href="/donor/dashboard" className="flex items-center">
                            <Image
                                src={RumahAmalHorizontalLogo}
                                alt="Rumah Amal Salman"
                                width={122}
                                height={30}
                                className="h-7 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    <div className="hidden items-center gap-10 md:flex">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`text-[12.5px] font-medium transition-colors ${pathname === item.href ? "text-[#07B0C8] underline decoration-2 underline-offset-8" : "text-gray-800 hover:text-cyan-600"}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="group relative hidden md:flex">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-2 py-1 transition-colors hover:bg-gray-50"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFF3F7]">
                                <Image
                                    src={UserPersonaLogo}
                                    alt="User Persona"
                                    width={16}
                                    height={16}
                                    className="h-4 w-4"
                                />
                            </span>
                            <span className="max-w-[110px] truncate text-[12.5px] font-medium text-[#111827]" title={username}>
                                {username}
                            </span>
                            <ChevronDown className="h-[14px] w-[14px] text-gray-500 transition-transform duration-150 group-hover:rotate-180" />
                        </button>

                        <div className="invisible absolute right-0 top-[calc(100%+8px)] z-20 w-36 rounded-lg border border-gray-200 bg-white p-1 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                            <button
                                type="button"
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="w-full rounded-md px-3 py-2 text-left text-[12.5px] font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#07B0C8]"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <span className="max-w-[96px] truncate text-[12.5px] font-medium text-[#111827]" title={username}>
                            {username}
                        </span>
                        <button
                            type="button"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="rounded-full border border-gray-200 px-3 py-1 text-[12px] font-medium text-gray-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}