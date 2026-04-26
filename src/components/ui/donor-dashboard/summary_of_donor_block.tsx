
import type { StaticImageData } from "next/image";
import Image from "next/image";

type DonorDashboardSummaryProps = {
    logo: StaticImageData | string;
    alt: string;
    title: string;
    caption: string;
    color: string;
};

export default function DonorDashboard_SummaryOfDonor(props: DonorDashboardSummaryProps) {

    return (
        <article className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-[0_3px_10px_-8px_rgba(17,24,39,0.18)] md:px-5 md:py-5">
            <div className="mb-3 flex items-center">
                <div
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: `#${props.color}1F` }}
                >
                    <Image
                        src={props.logo}
                        alt={props.alt}
                        className="h-[16px] w-[16px]"
                    />
                </div>
            </div>

            <p className="text-xs font-medium text-[#6B7280]">
                {props.title}
            </p>
            <p className="mt-1 text-xl font-bold leading-tight tracking-tight text-[#111827]">
                {props.caption}
            </p>
        </article>
    );
}