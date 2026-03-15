import Image from "next/image";
import localFont from "next/font/local";

import LandingBannerImage from "../../public/landing-banner-image.svg"
import ArrowRightWhite from "../../public/arrow-right-white.svg"
import GraduationCap from "../../public/graduation-cap.svg"
import HandCoins from "../../public/hand-coins.svg"
import ArrowRightGrey from "../../public/arrow-right-grey.svg"
import NavigationBar from "@/components/ui/navbar";

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

        <div className="absolute inset-0 z-20 bg-[#07B0C8]/40 bg-linear-to-t from-white to-transparent" />

        {/* container for the main content */}
        <div className="relative z-30 w-full flex-1 flex flex-col items-center justify-center">

          {/* title */}
          <div className={`${plusJakartaSansFont.className} w-full h-full`}>
            Empowering Students with Interest-Free Loans
          </div>

          {/* captions */}
          <div className="w-full h-full">
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
      <div className="w-full h-[80%]">

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
            <div>

              {/* number 1 */}
              <div>
                1
              </div>

              {/* title */}
              <div>
                Fund Donation
              </div>

              {/* caption */}
              <div>
                Generous donors contribute to our collective fund pool, creating a sustainable source of interest-free loans for students who need it most.
              </div>

            </div>

            {/* right arrow */}
            <div>
              <Image 
                src={ArrowRightGrey}
                alt="Grey Right Arrow"
              />
            </div>

            {/* application & verification container */}
            <div>

              {/* number 1 */}
              <div>
                2
              </div>

              {/* title */}
              <div>
                Application & Verification
              </div>

              {/* caption */}
              <div>
                Students submit their loan applications, which are carefully reviewed and verified by our transparent and independent selection committee.
              </div>

            </div>

            {/* right arrow */}
            <div>
              <Image 
                src={ArrowRightGrey}
                alt="Grey Right Arrow"
              />
            </div>

            {/* impactful distribution container */}
            <div>

              {/* number 1 */}
              <div>
                3
              </div>

              {/* title */}
              <div>
                Impactful Distribution
              </div>

              {/* caption */}
              <div>
                Once approved, loans are distributed directly to students - empowering them to focus on their education without any financial burden or interest.
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* -------------------------- impact in numbers (total donated + students helped + interest charged) -------------------- */}
      <div>

      </div>

      {/* ---------------------------- trust + transparency + steps for trust and transparency --------------------------- */}
      <div>

      </div>

      {/* --------------------------------- call to action (ready to make a difference?) ----------------------------- */}
      <div>

      </div>

    </div>
  );
}
