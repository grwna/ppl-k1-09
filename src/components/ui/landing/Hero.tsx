'use client';

import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => {
  return (
    <section id="home" className="relative w-full bg-[#F3F4F6] pb-28 md:pb-20">
      <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('/landing-banner-image.svg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07B0C8]/72 via-[#07B0C8]/52 to-[#07B0C8]/30" />
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-8 flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-[2.35rem] md:text-[3.45rem] leading-[1.05] font-extrabold tracking-tight">
              Empowering Students with Interest-Free Loans
            </h1>
            <p className="mt-5 text-[13.5px] md:text-[16px] text-white/85 leading-relaxed max-w-[52ch]">
              In collaboration with Rumah Amal Salman, RAS1 provides ethical, Sharia-compliant
              financial assistance to students in need with absolutely zero interest charged.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto -mt-14 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.45)] border border-gray-100">
          <div className="p-6 md:p-7 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#FCB82E]/15 p-2.5">
                <Image src="/hand-coins.svg" alt="Hand Coins" width={20} height={20} />
              </div>
              <div>
                <h3 className="text-[24px] leading-none font-bold text-[#1F2937]">Become a Donor</h3>
                <p className="mt-4 text-[13.5px] text-gray-600 leading-relaxed max-w-[48ch]">
                  Help fund interest-free loans and support students in achieving their
                  educational dreams.
                </p>
                <Link
                  href="/donor/donate-form"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FCB82E] hover:bg-[#e7a722] px-4 py-2 text-[13px] font-semibold text-white transition-colors"
                >
                  Become a Donor
                  <Image src="/arrow-right-white.svg" alt="Arrow Right" width={14} height={14} />
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#07B0C8]/15 p-2.5">
                <Image src="/graduation-cap.svg" alt="Graduation Cap" width={20} height={20} />
              </div>
              <div>
                <h3 className="text-[24px] leading-none font-bold text-[#1F2937]">Apply for a Loan</h3>
                <p className="mt-4 text-[13.5px] text-gray-600 leading-relaxed max-w-[48ch]">
                  Students can apply for an interest-free loan to cover tuition, books, and
                  living expenses.
                </p>
                <Link
                  href="/applicant/apply"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#07B0C8] hover:bg-[#0698ac] px-4 py-2 text-[13px] font-semibold text-white transition-colors"
                >
                  Apply for a Loan
                  <Image src="/arrow-right-white.svg" alt="Arrow Right" width={14} height={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
