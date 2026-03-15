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
    <div className="w-full h-full">

      {/* ----------------------------- navigation bar -----------------------------------*/}
      <NavigationBar/>

      {/* =------------------------------------ banner + offer for donor or loan --------------------------- */}
      <div className="relative w-full h-full">

        {/* dua div di bawah ini itu gradient sm gambar */}
        <div className="bg-[url(../../public/landing-banner-image.svg)] absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"></div>

        <div className="absolute inset-0 z-10 bg-linear-to-t from-white via-white/50 to-transparent" />

        {/* container for the main content */}
        <div className="relative z-20 w-full h-full">

          {/* title */}
          <div className={`${plusJakartaSansFont.className}`}>
            Empowering Students with Interest-Free Loans
          </div>

          {/* captions */}
          <div>
            In collaboration with Rumah Amal Salman, RAS1 provides ethical, Sharia-compliant financial assistance to students in need - with absolutely zero interest charged.
          </div>

          {/* become a donor + apply for a loan container */}
          <div className="flex w-full h-full justify-center items-center">

            {/* become a donor + apply for a loan block */}
            <div className="flex w-[90%] h-full justify-center items-center">

              {/* become a donor block */}
              <div className="flex w-[50%] bg-white">
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
              <div className="flex w-[50%] bg-white">
                {/* donor logo */}
                <div className="">
                  <Image
                    src={GraduationCap}
                    alt="Education logo"
                  />
                </div>

                {/* captions for becoming a donor */}
                <div className="">

                  {/* title caption */}
                  <div>
                    Apply for a Loan
                  </div>

                  {/* main caption */}
                  <div>
                    Students can apply for an interest-free loan to cover tuition, books, and living expenses.
                  </div>

                  {/* CTA become a donor */}
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
      <div>

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
