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
      <div className="relative w-full h-[60%] overflow-hidden flex flex-1 flex-col">

        {/* dua div di bawah ini itu gradient sm gambar */}
        <div className="bg-[url(../../public/landing-banner-image.svg)] absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"/>

        <div className="absolute inset-0 z-10 bg-linear-to-t from-white via-white/20 to-transparent" />

        <div className="absolute inset-0 z-20 bg-[#07B0C8]/70 bg-linear-to-t from-white to-transparent" />

        {/* container for the main content */}
        <div className="relative z-30 w-full flex-1 flex flex-col items-center justify-end">

          {/* title */}
          <div className={`${plusJakartaSansFont.className} w-full h-full font-extrabold text-white flex justify-start items-center pl-[5%] text-shadow-2xs text-[56px]`}>
            Empowering Students with Interest-Free Loans
          </div>

          {/* captions */}
          <div className={`${plusJakartaSansFont.className} w-full h-full font-extrabold text-white flex justify-start items-center pl-[5%]`}>
            In collaboration with Rumah Amal Salman, RAS1 provides ethical, Sharia-compliant financial assistance to students in need - with absolutely zero interest charged.
          </div>

          {/* become a donor + apply for a loan container */}
          <div className="flex w-full h-full justify-center items-center">

            {/* become a donor + apply for a loan block */}
            <div className="flex w-[90%] h-full justify-center items-center">

              {/* become a donor block */}
              <div className="flex w-[50%] bg-white p-2 rounded-l-2xl">
                {/* donor logo */}
                <div className="">
                  <Image
                    src={HandCoins}
                    alt="Coin handing logo"
                  />
                </div>

                {/* captions for becoming a donor */}
                <div className="">

                  {/* title caption */}
                  <div>
                    Become a donor
                  </div>

                  {/* main caption */}
                  <div>
                    Help fund interest-free loans and support students in achieving their educational dreams.
                  </div>

                  {/* CTA become a donor */}
                  <div className="flex justify-center items-center">

                    <div className="bg-[#FCB82E] flex w-[80%] justify-center items-center">
                      {/* caption */}
                      <div className="flex w-full h-full justify-center items-center">
                        Become a donor
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

              {/* apply for a loan block */}
              <div className="flex w-[50%] bg-white p-2 rounded-r-2xl">
                {/* education logo */}
                <div className="">
                  <Image
                    src={GraduationCap}
                    alt="Education logo"
                  />
                </div>

                {/* captions for appllying for a loan */}
                <div className="">

                  {/* title caption */}
                  <div>
                    Apply for a Loan
                  </div>

                  {/* main caption */}
                  <div>
                    Students can apply for an interest-free loan to cover tuition, books, and living expenses.
                  </div>

                  {/* CTA apply a loan */}
                  <div className="flex justify-center items-center">
                    <div className="bg-[#07B0C8] flex w-[80%] justify-center items-center">
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
    
          </div>

        </div>

      </div>

      {/* --------------------------- how it works + the steps of working in rumah amal salman ----------------- */}
      <div className="flex w-full h-[65%] justify-center items-center">

        {/* title + separator + caption */}
        <div className="flex flex-col justify-center items-center">
          {/* title */}
          <div>
            How It Works
          </div>

          {/* separator */}
          <div className="bg-[#07B0C8] h-0.5 w-50"/>

          {/* caption */}
          <div>
            Our streamlined process ensures every donation makes a real impact and every student gets fair, transparent access.
          </div>
          
          {/* grid of how it works (it is actually implemented using flex, so please don't be misled) */}
          <div className="flex justify-center items-center">

            {/* fund donation container */}
            <LandingHowItWorkBox number="1" title="Fund Donation" caption="Generous donors contribute to our collective fund pool, creating a sustainable source of interest-free loans for students who need it most." />

            {/* right arrow */}
            <div>
              <Image 
                src={ArrowRightGrey}
                alt="Grey Right Arrow"
              />
            </div>

            {/* application & verification container */}
            <LandingHowItWorkBox number="2" title="Application & Verification" caption="Students submit their loan applications, which are carefully reviewed and verified by our transparent and independent selection committee." />

            {/* right arrow */}
            <div>
              <Image 
                src={ArrowRightGrey}
                alt="Grey Right Arrow"
              />
            </div>

            {/* impactful distribution container */}
            <LandingHowItWorkBox number="3" title="Impactful Distribution" caption="Once approved, loans are distributed directly to students - empowering them to focus on their education without any financial burden or interest." />

          </div>
        </div>

      </div>

      {/* -------------------------- impact in numbers (total donated + students helped + interest charged) -------------------- */}
      <div className="flex w-full h-[65%] justify-center items-center">

        {/* title + separator + caption */}
        <div className="flex flex-col justify-center items-center">
          {/* title */}
          <div>
            Our Impact in Numbers
          </div>

          {/* separator */}
          <div className="bg-[#FCB82E] h-0.5 w-50"/>

          {/* caption */}
          <div>
            Every number represents real lives changed through the power of ethical giving.
          </div>
          
          {/* grid of how it works (it is actually implemented using flex, so please don't be misled) */}
          <div className="flex justify-center items-center">

            {/* total donated container */}
            <LandingImpactInNumberBox logo={DollarSign} alt="Dollar Sign" title="Rp 2.5B+" subtitle="Total Donated" caption="Funds raised from generous donors across Indonesia" />
            {/* total donated container */}
            <LandingImpactInNumberBox logo={DollarSign} alt="Dollar Sign" title="Rp 2.5B+" subtitle="Total Donated" caption="Funds raised from generous donors across Indonesia" />
            {/* total donated container */}
            <LandingImpactInNumberBox logo={DollarSign} alt="Dollar Sign" title="Rp 2.5B+" subtitle="Total Donated" caption="Funds raised from generous donors across Indonesia" />

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
