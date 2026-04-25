import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "@/components/ui/footer";
import "./globals.css";

import QueryClientProvider from "@/providers/QueryClientProvider";
import AuthSessionProvider from "@/providers/SessionProvider";

const plusJakartaSans = localFont({
    src: "../../public/fonts/PlusJakartaSans-VariableFont.ttf",
    variable: "--font-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "SalmanAid : Your Funding Solution",
    description: "A charity-based funding program established by Rumah Amal Salman",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${plusJakartaSans.variable} ${plusJakartaSans.className} font-sans antialiased bg-[#F9FAFB] min-h-screen flex flex-col`}
            >
                <AuthSessionProvider>
                    <QueryClientProvider>
                        <main className="grow">
                            {children}
                            <Footer />
                        </main>
                    </QueryClientProvider>
                </AuthSessionProvider>
            </body>
        </html>
    );
}
