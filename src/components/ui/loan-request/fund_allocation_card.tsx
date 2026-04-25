"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useLoanRequestStore } from "@/hooks/loanRequestStore";

// Mock Data
const DONOR_POOL = [
  { id: 1, name: "Fajar Kurniawan", available: 1000000000, fund: "General Fund" },
  { id: 2, name: "Siti Aminah", available: 500000000, fund: "Special Fund" },
  { id: 3, name: "Budi Santoso", available: 250000000, fund: "Tech Grant" },
  { id: 4, name: "Yayasan ABC", available: 750000000, fund: "Education Pool" },
];

export default function MapFundsModal() {
  const [allocations, setAllocations] = useState<any[]>([]); // Array of {donor, amount}
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter out donors already added to the list
  const availableDonors = useMemo(() => {
    const selectedIds = allocations.map((a) => a.donor.id);
    return DONOR_POOL.filter(
      (d) => !selectedIds.includes(d.id) && d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allocations, searchTerm]);

  const isAllocationFundModalOpen = useLoanRequestStore((state) => state.isAllocationFundModalOpen)
  const setAllocationFundModalOpen = useLoanRequestStore((state) => (state.setAllocationFundModalOpen))

  const addAllocation = (donor: any) => {
    setAllocations([...allocations, { donor, amount: "" }]);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const updateAmount = (index: number, value: string) => {
    const newAllocations = [...allocations];
    newAllocations[index].amount = value;
    setAllocations(newAllocations);
  };

  return (
    <div className="w-[75%] mx-auto bg-white rounded-3xl shadow-2xl flex flex-col h-150 text-slate-800 overflow-hidden px-8 py-4">    
      {/* Header */}
      <div className="flex flex-col justify-between py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Map Funds to Borrower</h2>
          <button className="text-gray-400" onClick={() => setAllocationFundModalOpen(!isAllocationFundModalOpen)}>✕</button>
        </div>
        <p className="text-gray-500 text-sm mt-1">Specify how much to allocate from the donor pool</p>
      </div>

        {/* scrollable section */}
      <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">

        {/* Target Borrower Section */}
        <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-slate-600">To Borrower</label>
            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-50">
                <p className="font-bold">Muhammad Fithra Rizki</p>
                <div className="flex justify-between items-end mt-1">
                <p className="text-xs text-slate-400">Computer Science</p>
                <p className="text-slate-600 font-medium">Rp 50.000.000</p>
                </div>
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* Dynamic Donor List */}
        <div className="flex flex-col gap-4">
            <label className="font-bold text-sm text-slate-600">Allocation Source</label>
            
            {allocations.map((item, index) => (
                <div key={item.donor.id} className="flex flex-col gap-3 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                    <p className="font-bold text-sm">{item.donor.name}</p>
                    <span className="w-fit text-[10px] px-2 py-0.5 bg-[#E0F7F9] text-[#00B5D8] rounded-full font-bold">
                        {item.donor.fund}
                    </span>
                    </div>
                    <div className="text-right">
                    <p className="text-[10px] text-slate-400">Available</p>
                    <p className="text-sm font-bold text-[#10B981]">Rp {item.donor.available.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <input
                    type="number"
                    placeholder="Enter amount (Rp)"
                    className="w-full bg-[#F1F5F9] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#7DD3E1] outline-none"
                    value={item.amount}
                    onChange={(e) => updateAmount(index, e.target.value)}
                />
                </div>
            ))}

            {/* Add Donor Search/Dropdown Container */}
            <div className="relative pb-4">
            {!isDropdownOpen ? (
                <button
                onClick={() => setIsDropdownOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium hover:bg-slate-50 transition-all"            >
                + Add {allocations.length > 0 ? "another" : "a"} donor
                </button>
            ) : (
                <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden -m-2.5">
                <input
                    autoFocus
                    placeholder="Search donor name..."
                    className="w-full p-4 border-b border-slate-100 outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="max-h-60 overflow-y-auto">
                    {availableDonors.length > 0 ? (
                    availableDonors.map((donor) => (
                        <div
                        key={donor.id}
                        onClick={() => addAllocation(donor)}
                        className="p-4 hover:bg-[#F8FAFC] cursor-pointer flex justify-between items-center transition-colors"
                        >
                        <div>
                            <p className="font-bold text-sm">{donor.name}</p>
                            <p className="text-xs text-slate-400">{donor.fund}</p>
                        </div>
                        <p className="text-xs font-bold text-[#10B981]">
                            Rp {donor.available.toLocaleString('id-ID')}
                        </p>
                        </div>
                    ))
                    ) : (
                    <p className="p-4 text-xs text-slate-400 text-center">No donors available</p>
                    )}
                </div>
                <button 
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full p-2 text-xs text-red-400 bg-slate-50 hover:bg-red-50"
                >
                    Cancel
                </button>
                </div>
            )}
            </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="p-8 pt-4 bg-white border-t border-slate-50">
        <div className="flex gap-3">
            <button className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">
            Cancel
            </button>
            <button 
            disabled={allocations.length === 0}
            className="flex-1 py-3 bg-[#87DCE9] rounded-xl font-bold text-white hover:bg-[#76cad7] disabled:opacity-50"
            >
            Confirm Allocation
            </button>
        </div>
      </div>
    </div>
  );
}