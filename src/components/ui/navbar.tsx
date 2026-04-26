'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/#how-it-works', label: 'Programs' },
  { href: '/#faq', label: 'FAQ' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[58px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/rumah-amal-horizontal-logo.svg"
                alt="Rumah Amal Salman"
                width={122}
                height={30}
                className="h-7 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[12.5px] transition-colors font-medium ${
                  item.label === 'Home' && pathname === '/'
                    ? 'text-[#07B0C8] underline underline-offset-8 decoration-2'
                    : 'text-gray-800 hover:text-cyan-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-[13px] text-gray-800 hover:text-gray-900 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="bg-cyan-500 hover:bg-cyan-600 text-white text-[12.5px] font-medium px-4.5 py-1.5 rounded-full transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-[13px] text-gray-700 hover:text-cyan-600 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center text-[13px] text-gray-700 font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center text-[13px] bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
