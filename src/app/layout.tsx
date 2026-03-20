import type { Metadata } from "next";
import Footer from "@/components/ui/footer";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

import QueryClientProvider from "@/providers/QueryClientProvider";
import AuthSessionProvider from "@/providers/SessionProvider";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
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
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F9FAFB] min-h-screen flex flex-col`}
            >
                <AuthSessionProvider>
                    <QueryClientProvider>
                        <main className="grow">
                            {children}
                        </main>
                    </QueryClientProvider>
                </AuthSessionProvider>
            </body>
        </html>
    );
}
