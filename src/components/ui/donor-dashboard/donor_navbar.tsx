
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

import RumahAmalHorizontalLogo from "../../../../public/rumah-amal-horizontal-logo.svg"
import UserPersonaLogo from "../../../../public/user_persona.svg"
import ChevronDownLogo from "../../../../public/chevron-down.svg"

import { useUserStore } from "@/hooks/userStore";

// init fonts
const plusJakartaSansFont = localFont({
    src: "../../../public/fonts/PlusJakartaSans-VariableFont.ttf",
    display: 'swap',
});

export default function DonorDashboard_DonorNavbar() {

    const username = useUserStore((state) => (state.user?.username))
    
    return (
        // main container
        <div className="flex justify-between items-center h-[10%] p-2">

            {/* rumah amal salman logo */}
            <div className="flex relative w-[10%] justify-center items-center">
                <Image
                    src={RumahAmalHorizontalLogo}
                    alt="Logo Rumah Amal Salman"
                    width={100}
                    height={100}
                />
            </div>

            {/* navigations */}
            <div className="flex gap-x-10 w-[70%] justify-center items-center">

                {/* Home */}
                <div className={`${plusJakartaSansFont.className} font-bold`}>
                    <Link href={'/donor/dashboard'}>Dashboard</Link>
                </div>

                {/* Donate */}
                <div className={`${plusJakartaSansFont.className} font-bold`}>
                    <Link href={'/donor/donate-form'}>Donate</Link>
                </div>

                {/* History */}
                <div className={`${plusJakartaSansFont.className} font-bold`}>
                    <Link href={'/not-found'}>History</Link>
                </div>

                {/* Report */}
                <div className={`${plusJakartaSansFont.className} font-bold`}>
                    <Link href={'/not-found'}>Repprt</Link>
                </div>

            </div>

            {/* account */}
            <div className="flex w-[15%] justify-around items-center">

                {/* login */}
                <div className="flex relative w-[10%] justify-center items-center">
                    <Image
                        src={UserPersonaLogo}
                        alt="User Persona"
                        width={100}
                        height={100}
                    />
                </div>

                {/* register */}
                <div className={`${plusJakartaSansFont.className} text-white font-bold bg-[#16C5DE] px-4 py-2 rounded-2xl`}>
                    {username}
                </div>

                {/* down chevron */}
                <div className="flex relative w-[10%] justify-center items-center">
                    <Image
                        src={ChevronDownLogo}
                        alt="Chevron down"
                        width={100}
                        height={100}
                    />
                </div>

            </div>

        </div>
    );
}