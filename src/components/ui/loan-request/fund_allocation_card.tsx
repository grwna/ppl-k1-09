"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useLoanRequestStore } from "@/hooks/loanRequestStore";

type DonorFundOption = {
  id: string;
  name: string;
  image?: string | null;
  available: number;
  totalAmount: number;
  fund: string;
};

type AllocationDraft = {
  donor: DonorFundOption;
  amount: string;
};

const formatCurrency = (amount: number | string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount) || 0).replace("IDR", "Rp");
};

export default function MapFundsModal() {
  const [allocations, setAllocations] = useState<AllocationDraft[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [donorPool, setDonorPool] = useState<DonorFundOption[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLoan = useLoanRequestStore((state) => state.selected_loan);
  const setSelectedLoan = useLoanRequestStore((state) => state.setSelectedLoan);
  const setAllocationFundModalOpen = useLoanRequestStore((state) => state.setAllocationFundModalOpen);

  const applicationId = selectedLoan.id || selectedLoan.loanApplicationId;
  const borrowerName = selectedLoan.name || selectedLoan.borrower?.name || "Borrower";
  const targetAmount = Number(selectedLoan.approvedAmount || selectedLoan.requestedAmount || 0);
  const currentLoanId = selectedLoan.loanId || selectedLoan.loan?.id || "";
  const existingAllocated = (selectedLoan.loan?.fundings || []).reduce(
    (total, funding) => total + (Number(funding.amount) || 0),
    0
  );
  const remainingToAllocate = Math.max(targetAmount - existingAllocated, 0);
  const totalAllocation = allocations.reduce((total, item) => total + (Number(item.amount) || 0), 0);

  // fetch the donor pools
  useEffect(() => {
    const fetchDonations = async () => {
      const baseUrl = `/api/donations`;

      try {
        const response = await fetch(`${baseUrl}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setDonorPool(result.data.donations || []);
      } catch (error) {
        console.error("Fetch error at admin/loan-request/page.tsx:", error);
      }

    }
    fetchDonations()

  }, [])

  // Filter out donors already added to the list
  const availableDonors = useMemo(() => {
    const selectedIds = allocations.map((a) => a.donor.id);
    return donorPool.filter(
      (d) => !selectedIds.includes(d.id) &&
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allocations, searchTerm, donorPool]);

  const addAllocation = (donor: DonorFundOption) => {
    setAllocations([...allocations, { donor, amount: "" }]);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setErrorMessage("");
  };

  const updateAmount = (index: number, value: string) => {
    const newAllocations = [...allocations];
    newAllocations[index].amount = value;
    setAllocations(newAllocations);
    setErrorMessage("");
  };

  const closeModal = (force = false) => {
    if (isSubmitting && !force) return;
    setAllocations([]);
    setSearchTerm("");
    setIsDropdownOpen(false);
    setErrorMessage("");
    setAllocationFundModalOpen(false);
  };

  const removeAllocation = (index: number) => {
    setAllocations((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleConfirmAllocation = async () => {
    if (!applicationId) {
      setErrorMessage("Application id tidak ditemukan.");
      return;
    }

    if (!currentLoanId) {
      setErrorMessage("Loan belum disetujui. Setujui pinjaman sebelum alokasi dana.");
      return;
    }

    if (allocations.length === 0) {
      setErrorMessage("Pilih minimal satu donor fund.");
      return;
    }

    for (const allocation of allocations) {
      const amount = Number(allocation.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        setErrorMessage("Semua nominal alokasi harus lebih dari 0.");
        return;
      }
      if (amount > allocation.donor.available) {
        setErrorMessage(`Alokasi untuk ${allocation.donor.name} melebihi dana tersedia.`);
        return;
      }
    }

    if (totalAllocation > remainingToAllocate) {
      setErrorMessage("Total alokasi melebihi sisa pinjaman yang belum dialokasikan.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const createdFundings: {
        id: string;
        loanId: string;
        donorFundId: string;
        sourceType: string;
        amount: number;
        donorFund?: {
          donor?: {
            name?: string | null;
          } | null;
        } | null;
      }[] = [];

      for (const allocation of allocations) {
        const response = await fetch("/api/loan-fundings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loanId: currentLoanId,
            donorFundId: allocation.donor.id,
            amount: Number(allocation.amount),
          }),
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.error || "Gagal mengalokasikan dana");
        }

        createdFundings.push({
          ...result.data,
          donorFund: {
            donor: {
              name: allocation.donor.name,
            },
          },
        });
      }

      setSelectedLoan({
        ...selectedLoan,
        loan: selectedLoan.loan
          ? {
              ...selectedLoan.loan,
              fundings: [
                ...(selectedLoan.loan.fundings || []),
                ...createdFundings.map((funding) => ({
                  id: funding.id,
                  amount: funding.amount,
                  donorFundId: funding.donorFundId,
                  sourceType: funding.sourceType,
                  donorFund: funding.donorFund,
                })),
              ],
            }
          : selectedLoan.loan,
      });

      closeModal(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengalokasikan dana");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[75%] mx-auto bg-white rounded-3xl shadow-2xl flex flex-col h-150 text-slate-800 overflow-hidden px-8 py-4">
      {/* Header */}
      <div className="flex flex-col justify-between py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Map Funds to Borrower</h2>
          <button className="text-gray-400 hover:text-slate-700" onClick={() => closeModal()}>✕</button>
        </div>
        <p className="text-gray-500 text-sm mt-1">Specify how much to allocate from the donor pool</p>
      </div>

      {/* scrollable section */}
      <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">

        {/* Target Borrower Section */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-slate-600">To Borrower</label>
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-50">
            <p className="font-bold">{borrowerName}</p>
            <div className="flex justify-between items-end mt-1">
              <p className="text-xs text-slate-400">{selectedLoan.institution || "Institution not provided"}</p>
              <p className="text-slate-600 font-medium">{formatCurrency(targetAmount)}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-white p-3">
                <p className="text-slate-400">Sudah dialokasikan</p>
                <p className="font-bold text-emerald-600">{formatCurrency(existingAllocated)}</p>
              </div>
              <div className="rounded-xl bg-white p-3">
                <p className="text-slate-400">Sisa belum dialokasikan</p>
                <p className="font-bold text-amber-600">{formatCurrency(remainingToAllocate)}</p>
              </div>
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
                  <p className="text-sm font-bold text-[#10B981]">{formatCurrency(item.donor.available)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={item.donor.available}
                  placeholder="Enter amount (Rp)"
                  className="w-full bg-[#F1F5F9] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#7DD3E1] outline-none"
                  value={item.amount}
                  onChange={(e) => updateAmount(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeAllocation(index)}
                  className="px-3 rounded-xl border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
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
                          {formatCurrency(donor.available)}
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
        <div className="flex justify-between text-sm text-slate-500 mb-3">
          <span>Total allocation</span>
          <span className="font-bold text-slate-700">{formatCurrency(totalAllocation)}</span>
        </div>
        {errorMessage && (
          <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {errorMessage}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => closeModal()}
            disabled={isSubmitting}
            className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAllocation}
            disabled={allocations.length === 0 || isSubmitting}
            className="flex-1 py-3 bg-[#87DCE9] rounded-xl font-bold text-white hover:bg-[#76cad7] disabled:opacity-50"
          >
            {isSubmitting ? "Allocating..." : "Confirm Allocation"}
          </button>
        </div>
      </div>
    </div>
  );
}
