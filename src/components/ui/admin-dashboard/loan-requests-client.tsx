"use client"

import React, { useState } from "react";
import { approveOrRejectLoanAction } from "@/actions/loan-approval.action";

export default function LoanRequestsClient({ applications, adminId, availableBalance }: { applications: any[], adminId: string, availableBalance: number }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [amounts, setAmounts] = useState<Record<string, number | "">>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [isFullAmount, setIsFullAmount] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

  const handleToggleFull = (id: string, reqAmount: number) => {
    const newState = !isFullAmount[id];
    setIsFullAmount(prev => ({ ...prev, [id]: newState }));
    
    if (newState) {
      const maxAllowed = Math.min(reqAmount, availableBalance);
      setAmounts(prev => ({ ...prev, [id]: maxAllowed }));
    }
  };

  const handleAmountChange = (id: string, val: string, reqAmount: number) => {
    const numVal = Number(val);
    const maxAllowed = Math.min(reqAmount, availableBalance);
    
    if (val !== "" && numVal > maxAllowed) {
      setAmounts(prev => ({ ...prev, [id]: maxAllowed }));
    } else {
      setAmounts(prev => ({ ...prev, [id]: val === "" ? "" : numVal }));
    }
  };

  const handleReasonChange = (id: string, val: string) => {
    setReasons(prev => ({ ...prev, [id]: val }));
  };

  async function handleAction(appId: string, status: "APPROVED" | "REJECTED") {
    setLoadingId(appId);
    setError("");
    
    const payload = {
      applicationId: appId,
      status,
      adminId,
      amount: amounts[appId] !== "" && amounts[appId] !== undefined ? (amounts[appId] as number) : undefined,
      reason: reasons[appId] || undefined,
    };

    const res = await approveOrRejectLoanAction(payload);
    
    if (!res.success) {
      setError(res.error || "Terjadi kesalahan pada sistem");
    } else {
      setAmounts(prev => {
        const next = { ...prev };
        delete next[appId];
        return next;
      });
      setReasons(prev => {
        const next = { ...prev };
        delete next[appId];
        return next;
      });
      setIsFullAmount(prev => {
        const next = { ...prev };
        delete next[appId];
        return next;
      });
    }
    
    setLoadingId(null);
  }

  const pendingApps = applications.filter(a => a.status === "PENDING");
  const approvedApps = applications.filter(a => a.status === "APPROVED");
  const rejectedApps = applications.filter(a => a.status === "REJECTED");

  const displayedApps = activeTab === "PENDING" ? pendingApps : activeTab === "APPROVED" ? approvedApps : rejectedApps;

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab("PENDING")}
          className={`py-3 px-6 font-semibold text-sm ${activeTab === "PENDING" ? "border-b-2 border-[#07B0C8] text-[#07B0C8]" : "text-gray-500 hover:text-gray-700"}`}
        >
          Menunggu ({pendingApps.length})
        </button>
        <button 
          onClick={() => setActiveTab("APPROVED")}
          className={`py-3 px-6 font-semibold text-sm ${activeTab === "APPROVED" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Disetujui ({approvedApps.length})
        </button>
        <button 
          onClick={() => setActiveTab("REJECTED")}
          className={`py-3 px-6 font-semibold text-sm ${activeTab === "REJECTED" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Ditolak ({rejectedApps.length})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md font-semibold">
          {error}
        </div>
      )}
      
      {displayedApps.length === 0 ? (
        <div className="text-gray-500 font-medium bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          Tidak ada data permohonan dengan status ini.
        </div>
      ) : (
        displayedApps.map((app) => (
          <div key={app.id} className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-[#07B0C8]">{app.description}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                {app.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="font-semibold block text-gray-500 mb-1">ID Pemohon Pinjaman</span>
                <span className="font-medium">{app.borrowerId}</span>
              </div>
              <div>
                <span className="font-semibold block text-gray-500 mb-1">Nama Pemohon</span>
                <span className="font-medium">{app.borrower?.name || "Tidak diketahui"}</span>
              </div>
              <div>
                <span className="font-semibold block text-gray-500 mb-1">Nominal Pengajuan</span>
                <span className="font-medium text-lg text-black">Rp {app.requestedAmount.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="font-semibold block text-gray-500 mb-1">Deskripsi Tujuan Pengajuan</span>
                <span className="font-medium">{app.collateralDescription}</span>
              </div>
              
              {app.status === "APPROVED" && app.approvedAmount && (
                <div className="col-span-1 md:col-span-2 mt-2 bg-green-50 p-3 rounded border border-green-100">
                  <span className="font-semibold block text-green-800 mb-1">Nominal Disetujui</span>
                  <span className="font-bold text-lg text-green-900">Rp {app.approvedAmount.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="col-span-1 md:col-span-2 mt-2">
                <span className="font-semibold block text-gray-500 mb-2">Dokumen Pendukung</span>
                <a 
                  href={app.collateralUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded border border-blue-100 font-medium hover:bg-blue-100"
                >
                  Lihat Dokumen Pendukung
                </a>
              </div>
            </div>

            {app.status === "PENDING" && (
              <div className="flex flex-col gap-5 border-t border-gray-100 pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-800">Nominal Disetujui (Rp)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500">Setujui Penuh</span>
                        <button
                          type="button"
                          onClick={() => handleToggleFull(app.id, app.requestedAmount)}
                          disabled={availableBalance <= 0}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${isFullAmount[app.id] ? 'bg-green-600' : 'bg-gray-300'}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isFullAmount[app.id] ? 'translate-x-6' : 'translate-x-1'}`}
                          />
                        </button>
                      </div>
                    </div>
                    <input 
                      type="number" 
                      max={Math.min(app.requestedAmount, availableBalance)}
                      disabled={isFullAmount[app.id] || availableBalance <= 0}
                      value={amounts[app.id] ?? ""} 
                      onChange={(e) => handleAmountChange(app.id, e.target.value, app.requestedAmount)} 
                      className={`w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#FCB82E] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors ${isFullAmount[app.id] || availableBalance <= 0 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-black'}`}
                      placeholder={`Maks: ${Math.min(app.requestedAmount, availableBalance)}`}
                    />
                    {availableBalance < app.requestedAmount && (
                      <p className="text-xs text-red-500 mt-2 font-bold">Dana tersedia (Rp {availableBalance.toLocaleString('id-ID')}) tidak cukup untuk memenuhi full permintaan ini.</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-2 text-gray-800">Alasan Keputusan</label>
                    <input 
                      type="text" 
                      value={reasons[app.id] ?? ""} 
                      onChange={(e) => handleReasonChange(app.id, e.target.value)} 
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#FCB82E] focus:outline-none"
                      placeholder="Wajib diisi jika ditolak"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button 
                    onClick={() => handleAction(app.id, "APPROVED")} 
                    disabled={loadingId === app.id || availableBalance <= 0} 
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {loadingId === app.id ? "Memproses..." : "Setujui Pinjaman"}
                  </button>
                  <button 
                    onClick={() => handleAction(app.id, "REJECTED")} 
                    disabled={loadingId === app.id} 
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {loadingId === app.id ? "Memproses..." : "Tolak Pinjaman"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}