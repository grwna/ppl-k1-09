import Image from "next/image";
import localFont from "next/font/local";

import ShieldSign from "../../public/shield.svg"
import DollarSign from "../../public/dollar.svg"
import PersonSign from "../../public/person.svg"
import PercentageSign from "../../public/percentage.svg"
import ArrowRightWhite from "../../public/arrow-right-white.svg"
import GraduationCap from "../../public/graduation-cap.svg"
import HandCoins from "../../public/hand-coins.svg"
import ArrowRightGrey from "../../public/arrow-right-grey.svg"
import NavigationBar from "@/components/ui/navbar";
import LandingTrustTransparencyBox from "@/components/ui/landing_trust_transparency_box";
import LandingCertificationBox from "@/components/ui/landing_certification_box";
import LandingHowItWorkBox from "@/components/ui/landing_how_it_work_box";
import LandingImpactInNumberBox from "@/components/ui/landing_impact_in_number_box";

// init fonts
const plusJakartaSansFont = localFont({
    src: "../../public/fonts/PlusJakartaSans-VariableFont.ttf",
    display: 'swap',
});

export default function Home() {

  // init variables


  return (
    // main container
    <div className="w-full h-screen">

      {/* ----------------------------- navigation bar -----------------------------------*/}
      <NavigationBar/>

      {/* =------------------------------------ banner + offer for donor or loan --------------------------- */}
      <div className="relative w-full h-[80%] overflow-hidden flex flex-1 flex-col">

        {/* dua div di bawah ini itu gradient sm gambar */}
        <div className="bg-[url(../../public/landing-banner-image.svg)] absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"/>

        <div className="absolute inset-0 z-10 bg-linear-to-t from-white via-white/20 to-transparent" />

        {/* <div class="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%  */}
        <div className="absolute inset-0 z-20 bg-linear-to-b from-[#07B0C8]/65 from-0% via-[#07B0C8]/30 via-50% to-[#F9FAFB] to-100%" />

        {/* container for the main content */}
        <div className="relative z-30 w-full flex-1 flex flex-col items-center justify-start">

          {/* title */}
          <div className={`${plusJakartaSansFont.className} w-full h-[40%] font-extrabold text-white flex justify-start items-center pl-[5%] pt-[5%] text-shadow-2xs text-[56px]`}>
            Empowering Students with Interest-Free Loans
          </div>

          {/* captions */}
          <div className={`${plusJakartaSansFont.className} w-full h-[20%] font-medium text-white flex justify-start items-center pl-[5%]`}>
            In collaboration with Rumah Amal Salman, RAS1 provides ethical, Sharia-compliant financial assistance to students in need - with absolutely zero interest charged.
          </div>

          {/* become a donor + apply for a loan container */}
          <div className="flex w-full h-[30%] justify-center items-center p-2">

            {/* become a donor + apply for a loan block */}
            <div className="flex w-[90%] h-full justify-center items-center shadow-[0_10px_6px_-2px_rgba(0,0,0,0.1)] rounded-2xl">

              {/* become a donor block */}
              <div className="flex w-[50%] h-full bg-white p-2 rounded-l-2xl">
                {/* donor logo */}
                <div className="w-[10%] h-fit flex justify-center items-center bg-[#FCB82E]/6 rounded-full">
                  <Image
                    src={HandCoins}
                    alt="Coin handing logo"
                    className="m-2"
                  />
                </div>

                {/* captions for becoming a donor */}
                <div className="w-[90%] h-full flex flex-col justify-start items-start">

                  {/* title caption */}
                  <div className={`${plusJakartaSansFont.className} w-full h-[30%] text-start font-semibold tracking-wide flex justify-start items-center`}>
                    Become a donor
                  </div>

                  {/* main caption */}
                  <div className={`${plusJakartaSansFont.className} w-full h-[30%] text-start font-normal text-sm flex justify-center items-center`}>
                    Help fund interest-free loans and support students in achieving their educational dreams.
                  </div>

                  {/* CTA become a donor */}
                  <div className="w-full h-[40%] flex justify-start items-center">

                    <div className="bg-[#FCB82E] flex w-[40%] h-[80%] justify-center items-center rounded-2xl">
                      {/* caption */}
                      <div className={`${plusJakartaSansFont.className} flex w-[80%] h-full text-sm font-medium text-white justify-center items-center`}>
                        Become a donor
                      </div>

                      {/* arrow right */}
                      <div className="flex w-[20%] h-full justify-center items-center">
                        <Image
                          src={ArrowRightWhite}
                          alt="Right White Arrow"
                        />
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* apply for a lon block */}
              <div className="flex w-[50%] h-full bg-white p-2 rounded-r-2xl">
                {/* eduacation logo */}
                <div className="w-[10%] h-fit flex justify-center items-center bg-[#07B0C8]/6 rounded-full">
                  <Image
                    src={GraduationCap}
                    alt="Education logo"
                    className="m-2"
                  />
                </div>

                {/* captions for becoming a donor */}
                <div className="w-[90%] h-full flex flex-col justify-start items-start">

                  {/* title caption */}
                  <div className={`${plusJakartaSansFont.className} w-full h-[30%] text-start font-semibold tracking-wide flex justify-start items-center`}>
                    Apply for a Loan
                  </div>

                  {/* main caption */}
                  <div className={`${plusJakartaSansFont.className} w-full h-[30%] text-start font-normal text-sm flex justify-center items-center`}>
                    Students can apply for an interest-free loan to cover tuition, books, and living expenses.
                  </div>

                  {/* CTA become a donor */}
                  <div className="w-full h-[40%] flex justify-start items-center">

                    <div className="bg-[#07B0C8] flex w-[40%] h-[80%] justify-center items-center rounded-2xl">
                      {/* caption */}
                      <div className={`${plusJakartaSansFont.className} flex w-[80%] h-full text-sm font-medium text-white justify-center items-center`}>
                        Apply for a Loan
                      </div>

                      {/* arrow right */}
                      <div className="flex w-[20%] h-full justify-center items-center">
                        <Image
                          src={ArrowRightWhite}
                          alt="Right White Arrow"
                        />
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </div>
    
          </div>

        </div>

      </div>

      {/* --------------------------- how it works + the steps of working in rumah amal salman ----------------- */}
      <div className="flex w-full h-[70%] justify-center items-center">

        {/* title + separator + caption */}
        <div className="flex flex-col justify-start items-center">
          {/* title */}
          <div className={`${plusJakartaSansFont.className} w-full h-[20%] text-[38px] flex justify-center items-center font-bold`}>
            How It Works
          </div>

          {/* separator */}
          <div className="bg-[#07B0C8] h-1 w-40"/>

          {/* caption */}
          <div className={`${plusJakartaSansFont.className} w-[55%] h-[20%] p-4 flex justify-center items-center font-medium text-[#666666] text-center text-sm`}>
            Our streamlined process ensures every donation makes a real impact and every student gets fair, transparent access.
          </div>
          
          {/* grid of how it works (it is actually implemented using flex, so please don't be misled) */}
          <div className="w-full h-[50%] flex justify-center items-center">

            {/* fund donation container */}
            <div className="w-[25%] h-full flex justify-center items-center">
              <LandingHowItWorkBox color="#FCB82E" number="1" title="Fund Donation" caption="Generous donors contribute to our collective fund pool, creating a sustainable source of interest-free loans for students who need it most." />
            </div>

            {/* right arrow */}
            <div className="h-full w-[10%] flex justify-center items-center">
              <Image 
                src={ArrowRightGrey}
                alt="Grey Right Arrow"
              />
            </div>

            {/* application & verification container */}
            <div className="w-[25%] h-full flex justify-center items-center">
              <LandingHowItWorkBox color="#07B0C8" number="2" title="Application & Verification" caption="Students submit their loan applications, which are carefully reviewed and verified by our transparent and independent selection committee." />
            </div>

            {/* right arrow */}
            <div className="h-full w-[10%] flex justify-center items-center">
              <Image 
                src={ArrowRightGrey}
                alt="Grey Right Arrow"
              />
            </div>

            {/* impactful distribution container */}
            <div className="w-[25%] h-full flex justify-center items-center">
              <LandingHowItWorkBox color="#10B981" number="3" title="Impactful Distribution" caption="Once approved, loans are distributed directly to students - empowering them to focus on their education without any financial burden or interest." />
            </div>

          </div>
        </div>

      </div>

      {/* -------------------------- impact in numbers (total donated + students helped + interest charged) -------------------- */}
      <div className="bg-[#07B0C8] flex w-full h-[65%] justify-center items-center">

        {/* title + separator + caption */}
        <div className="w-full h-full flex flex-col justify-center items-center">
          {/* title */}
          <div className={`${plusJakartaSansFont.className} font-bold text-[38px] text-white h-[15%] w-full text-center`}>
            Our Impact in Numbers
          </div>

          {/* separator */}
          <div className="bg-[#FCB82E] h-1 w-40"/>

          {/* caption */}
          <div className={`${plusJakartaSansFont.className} font-light text-sm text-white h-[10%] w-full text-center flex justify-center items-center`}>
            Every number represents real lives changed through the power of ethical giving.
          </div>
          
          {/* grid of how it works (it is actually implemented using flex, so please don't be misled) */}
          <div className="flex justify-between items-center h-[65%] w-full py-2 px-4">

            {/* total donated container */}
            <LandingImpactInNumberBox logo={DollarSign} alt="Dollar Sign" title="Rp 2.5B+" subtitle="Total Donated" caption="Funds raised from generous donors across Indonesia" />
            {/* total donated container */}
            <LandingImpactInNumberBox logo={PersonSign} alt="Dollar Sign" title="500+" subtitle="Students Helped" caption="Lives transformed through accessible education funding" />
            {/* total donated container */}
            <LandingImpactInNumberBox logo={PercentageSign} alt="Dollar Sign" title="0%" subtitle="Zero Interest Charged" caption="Fully Sharia-compliant, ethical financial assistance" />

          </div>
        </div>

      </div>

      {/* ---------------------------- trust + transparency + steps for trust and transparency --------------------------- */}
      <div className="flex w-full h-[65%] justify-center items-center">

        {/* title + separator + caption */}
        <div className="flex flex-col justify-center items-center">
          {/* title */}
          <div>
            Trust & Transparency
          </div>

          {/* separator */}
          <div className="bg-[#07B0C8] h-0.5 w-50"/>

          {/* caption */}
          <div>
            Your trust is our foundation. We maintain the highest standards of security, transparency, and ethical financial management.
          </div>
          
          {/* grid of trust and transparency */}
          <div className="grid grid-cols-3 grid-rows-2 justify-center items-center">

            {/* secure payment gateway container */}
            <LandingTrustTransparencyBox logo={ShieldSign} alt="Shield Logo" title="Secure Payment " caption="All transactions are protected with bank-level SSL encryption and secure processing."/>
            <LandingTrustTransparencyBox logo={ShieldSign} alt="Shield Logo" title="Secure Payment " caption="All transactions are protected with bank-level SSL encryption and secure processing."/>
            <LandingTrustTransparencyBox logo={ShieldSign} alt="Shield Logo" title="Secure Payment " caption="All transactions are protected with bank-level SSL encryption and secure processing."/>
            <LandingTrustTransparencyBox logo={ShieldSign} alt="Shield Logo" title="Secure Payment " caption="All transactions are protected with bank-level SSL encryption and secure processing."/>
            <LandingTrustTransparencyBox logo={ShieldSign} alt="Shield Logo" title="Secure Payment " caption="All transactions are protected with bank-level SSL encryption and secure processing."/>
            <LandingTrustTransparencyBox logo={ShieldSign} alt="Shield Logo" title="Secure Payment " caption="All transactions are protected with bank-level SSL encryption and secure processing."/>

          </div>

          {/* certification */}
          <div className="h-[10%] w-[80%] flex justify-center items-center">
            
            <LandingCertificationBox logo={ShieldSign} alt="Shield Logo" caption="SSL Secured"/>
            <LandingCertificationBox logo={ShieldSign} alt="Shield Logo" caption="SSL Secured"/>
            <LandingCertificationBox logo={ShieldSign} alt="Shield Logo" caption="SSL Secured"/>
            <LandingCertificationBox logo={ShieldSign} alt="Shield Logo" caption="SSL Secured"/>

          </div>
        </div>

      </div>

      {/* --------------------------------- call to action (ready to make a difference?) ----------------------------- */}
      <div className="flex flex-col justify-center items-center w-full h-[35%]">

        {/* title : Ready to make a difference? */}
        <div>
          Ready to make a difference?
        </div>

        {/* caption */}
        <div>
          Whether you want to support a student's future or need financial help for your education, Rumah Amal Salman is here for you. Join our growing community of changemakers.
        </div>

        {/* cta : become a donor + apply for a loan */}
        <div className="flex justify-center items-center w-full">

          {/* CTA become a donor */}
          <div className="flex justify-end items-center w-[50%] p-2">
            <div className="bg-[#FCB82E] flex w-[80%] justify-center items-center">

              {/* arrow right */}
              <div className="flex w-full h-full justify-center items-center">
                <Image
                  src={ArrowRightWhite}
                  alt="Right White Arrow"
                />
              </div>

              {/* caption */}
              <div className="flex w-full h-full justify-center items-center">
                Become a Donor
              </div>

              {/* arrow right */}
              <div className="flex w-full h-full justify-center items-center">
                <Image
                  src={ArrowRightWhite}
                  alt="Right White Arrow"
                />
              </div>

            </div>

          </div>
          
          {/* CTA apply a loan */}
          <div className="flex justify-start items-center w-[50%] p-2">
            <div className="bg-[#07B0C8] flex w-[80%] justify-center items-center">

              {/* arrow right */}
              <div className="flex w-full h-full justify-center items-center">
                <Image
                  src={ArrowRightWhite}
                  alt="Right White Arrow"
                />
              </div>

              {/* caption */}
              <div className="flex w-full h-full justify-center items-center">
                Apply for a Loan
              </div>

              {/* arrow right */}
              <div className="flex w-full h-full justify-center items-center">
                <Image
                  src={ArrowRightWhite}
                  alt="Right White Arrow"
                />
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
