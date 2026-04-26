'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Link from 'next/link';
import Image from 'next/image';

import BlueHeartLogo from "../../../../../public/heart-blue.svg"
import { useDonationStore } from '@/hooks/donationStore';
import DonorDashboard_DonorNavbar from "@/components/ui/donor-dashboard/donor_navbar";

export default function PaymentSuccessPage() {

    const amount = useDonationStore((state) => (state.donation.amount))
    const paymentMethod = useDonationStore((state) => (state.donation.payment_method))

    const donation_detail = {
        donation_id: "DON001",
        payment_method: paymentMethod ,
        amount: amount,
    }


  return (

    <div className="flex flex-col justify-center items-center w-full h-fit">
        
        {/* donor navbar */}
        <div className="w-full h-fit justify-center items-center">
            <DonorDashboard_DonorNavbar />
        </div>

        <div className="min-h-screen w-full bg-gradient-to-br from-[#07B0C8]/10 to-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8 flex items-center">

            <div className="max-w-md mx-auto w-full">
                {/* Success Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">

                    {/* Success Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 bg-[#07B0C8]/20 rounded-full flex items-center justify-center">
                        {/* <svg
                            className="w-8 h-8 text-[#07B0C8]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                            />
                        </svg> */}

                            <Image 
                                src={BlueHeartLogo}
                                alt='Blue Heart Logo'
                            />
                        </div>
                    </div>

                    {/* donation progress */}
                    <div className='flex justify-between items-center p-2'>

                        {/* 1 : select amount */}
                        <div className='flex flex-col justify-center items-center text-sm'>
                            
                            {/* number container */}
                            <div className='flex justify-center items-center bg-[#07B0C8] rounded-full'>

                            {/* number */}
                            <div className='flex justify-center items-center p-2 text-white'>
                                1
                            </div>

                            </div>

                            {/* caption */}
                            <div>
                                Select Amount
                            </div>
                            
                        </div>

                        {/* 2 : payment */}
                        <div className='flex flex-col justify-center items-center text-sm'>
                            
                            {/* number container */}
                            <div className='flex justify-center items-center bg-[#07B0C8] rounded-full'>

                            {/* number */}
                            <div className='flex justify-center items-center p-2 text-white'>
                                2
                            </div>
                            
                            </div>

                            {/* caption */}
                            <div>
                            Payment
                            </div>
                            
                        </div>

                        {/* 3 : confirmation */}
                        <div className='flex flex-col justify-center items-center text-sm'>
                            
                            {/* number container */}
                            <div className='flex justify-center items-center bg-[#07B0C8] rounded-full'>

                            {/* number */}
                            <div className='flex justify-center items-center p-2 text-white'>
                                3
                            </div>
                            
                            </div>

                            {/* caption */}
                            <div>
                            Confirmation
                            </div>
                            
                        </div>

                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Generosity!</h1>

                    {/* Message */}
                    <p className="text-gray-600 mb-6">
                    Your donation of Rp {amount} has been received.
                    </p>

                    {/* donation detail table */}
                    <div>

                        <Table>
                            <TableBody>
                                <TableRow>
                                <TableHead>Donation ID</TableHead>
                                <TableCell>{donation_detail.donation_id}</TableCell>
                                </TableRow>

                                <TableRow>
                                <TableHead>Payment Method</TableHead>
                                <TableCell>{donation_detail.payment_method}</TableCell>
                                </TableRow>

                                <TableRow>
                                <TableHead>Amount</TableHead>
                                <TableCell>{donation_detail.amount}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-2">

                        {/* back to home */}
                        <Link
                        href="/"
                        className="block w-full px-4 py-2 bg-[#07B0C8] text-white rounded-md hover:bg-[#059BB0] font-medium transition"
                        >
                        Back to Home
                        </Link>

                        {/* back to donor/dashboard */}
                        <Link
                        href="/donor/dashboard"
                        className="block w-full px-4 py-2 bg-[#F9FAFB] text-[#07B0C8] border border-[#07B0C8] rounded-md hover:bg-[#07B0C8]/5 font-medium transition"
                        >
                        View Dashboard
                        </Link>

                        {/* back to donor/donate-form */}
                        <Link
                        href="/donor/donate-form"
                        className="block w-full px-4 py-2 bg-[#F9FAFB] text-[#07B0C8] rounded-md hover:bg-[#07B0C8]/5 font-medium transition text-sm"
                        >
                        Make Another Donation
                        </Link>

                    </div>

                    {/* Footer Note */}
                    <p className="text-xs text-gray-500 mt-6">
                        If you have any questions, please contact our support team.
                    </p>
                </div>

            </div>

        </div>
    </div>
  );
}
