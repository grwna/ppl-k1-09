'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useMemo } from "react";

import { useUserStore } from "@/hooks/userStore";

import RumahAmalHorizontalLogo from "../../../../public/rumah-amal-horizontal-logo.svg";
import UserPersonaLogo from "../../../../public/user_persona.svg";

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/loan-request', label: 'Pengajuan Pinjaman' },
  { href: '/admin/account-verifications', label: 'Verifikasi Akun' },
  { href: '/admin/monitoring', label: 'Monitoring' },
  { href: '/admin/content/landing', label: 'Konten CMS' },
  { href: '/admin/users', label: 'Daftar Pengguna' },
];

export default function AdminDashboard_AdminNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const usernameFromStore = useUserStore((state) => state.user?.username);
  const username = useMemo(() => {
    return usernameFromStore || session?.user?.name || "Admin";
  }, [usernameFromStore, session?.user?.name]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 w-full shadow-sm">
      <div className="max-w-350 mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14.5">

          {/* Logo */}
          <Link href="/admin/dashboard" className="shrink-0 flex items-center">
            <Image
              src={RumahAmalHorizontalLogo}
              alt="Logo Rumah Amal Salman"
              width={115}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[12.5px] font-medium transition-colors ${
                    isActive
                      ? 'text-[#07B0C8] underline underline-offset-8 decoration-2 decoration-[#07B0C8]'
                      : 'text-gray-700 hover:text-[#07B0C8]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Unified Profile & Mobile Menu Dropdown */}
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white px-2 py-1 transition-colors hover:bg-gray-50 focus:outline-none"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFF3F7]">
                <Image
                  src={UserPersonaLogo}
                  alt="User"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              </span>
              <span className="max-w-20 xs:max-w-24 sm:max-w-27.5 truncate text-[12.5px] font-medium text-[#111827]" title={username}>
                {username}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-500 transition-transform duration-150 group-hover:rotate-180" />
            </button>

            {/* Responsive Dropdown Menu Drawer */}
            <div className="invisible absolute right-0 top-[calc(100%+8px)] z-20 w-64 rounded-2xl border border-gray-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              
              {/* Mobile Drawer Links (Hidden on Desktop) */}
              <div className="flex flex-col border-b border-gray-100 pb-1.5 mb-1.5 md:hidden">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Menu
                </div>
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[12.5px] font-medium transition-colors ${
                        isActive 
                          ? "bg-[#F0FBFD] text-[#07B0C8]" 
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#07B0C8]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Account Action */}
              <div className="flex flex-col gap-1">
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider md:hidden">
                  Akun
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-[12.5px] font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#07B0C8]"
                >
                  Logout
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}
