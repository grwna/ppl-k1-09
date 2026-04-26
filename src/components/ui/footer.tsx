import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-[#222429] text-gray-300 pt-12 md:pt-14 pb-6 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div>
                        <Image
                            src="/rumah-amal-horizontal-logo.svg"
                            alt="Rumah Amal Salman Horizontal Logo"
                            width={140}
                            height={36}
                            className="h-8 w-auto"
                        />
                        <p className="mt-4 text-[13px] leading-relaxed text-gray-400 max-w-[28ch]">
                            An ethical, interest-free student loan management system by Rumah Amal
                            Salman. Empowering education through Islamic philanthropy.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[14px] font-semibold text-white">Quick Links</h3>
                        <ul className="mt-4 space-y-2 text-[13px]">
                            <li><Link href="/" className="hover:text-white">Home</Link></li>
                            <li><Link href="/#how-it-works" className="hover:text-white">Programs</Link></li>
                            <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
                            <li><Link href="/" className="hover:text-white">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[14px] font-semibold text-white">Resources</h3>
                        <ul className="mt-4 space-y-2 text-[13px]">
                            <li><Link href="/" className="hover:text-white">Transparency Report</Link></li>
                            <li><Link href="/" className="hover:text-white">Annual Report</Link></li>
                            <li><Link href="/" className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="/" className="hover:text-white">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[14px] font-semibold text-white">Contact Us</h3>
                        <ul className="mt-4 space-y-3 text-[13px] text-gray-400">
                            <li className="flex items-start gap-2">
                                <Mail className="w-4 h-4 mt-0.5" />
                                <span>info@rumahamal.org</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="w-4 h-4 mt-0.5" />
                                <span>+62 812 3456 7890</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5" />
                                <span>Bandung, West Java, Indonesia</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-700/60 pt-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <p className="text-[12px] text-gray-500">
                        © 2026 RAS1 - Rumah Amal Salman. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-[12px] text-gray-500">
                        <Link href="/" className="hover:text-gray-300">Privacy</Link>
                        <Link href="/" className="hover:text-gray-300">Terms</Link>
                        <Link href="/" className="hover:text-gray-300">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}