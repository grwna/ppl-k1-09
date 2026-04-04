"use client";

import { useEffect, useState } from "react";

export default function DummyAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      const result = await response.json();
      if (response.ok) {
        setDashboardData(result.data);
      } else {
        setError(result.error || "Gagal memuat data");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Fungsi untuk Handle Accept / Reject
  const handleUpdateStatus = async (loanId: string, status: "APPROVED" | "REJECTED") => {
    if (!confirm(`Yakin ingin mengubah status menjadi ${status}?`)) return;
    
    setActionLoading(loanId);
    try {
      const response = await fetch(`/api/admin/loans/${loanId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        fetchDashboard(); // Refresh data setelah berhasil
      } else {
        alert("Gagal: " + result.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="text-center mt-20">Memuat Dashboard...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Dummy Dashboard Admin</h1>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white border shadow rounded">
          <p className="text-sm text-gray-500">Total Pengajuan</p>
          <p className="text-2xl font-bold">{dashboardData?.statistics.totalLoans}</p>
        </div>
        <div className="p-4 bg-white border shadow rounded">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-orange-500">{dashboardData?.statistics.pendingLoans}</p>
        </div>
        <div className="p-4 bg-white border shadow rounded">
          <p className="text-sm text-gray-500">Total Donatur</p>
          <p className="text-2xl font-bold">{dashboardData?.statistics.totalDonations}</p>
        </div>
        <div className="p-4 bg-white border shadow rounded">
          <p className="text-sm text-gray-500">Dana Terkumpul</p>
          <p className="text-2xl font-bold text-green-600">Rp {dashboardData?.statistics.totalDonationAmount}</p>
        </div>
      </div>

      {/* Daftar Pengajuan Pinjaman */}
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">Daftar Pengajuan Pinjaman</h2>
      <div className="space-y-4 mb-10">
        {dashboardData?.recentLoans.length === 0 ? (
          <p className="text-gray-500">Belum ada pengajuan pinjaman.</p>
        ) : (
          dashboardData?.recentLoans.map((loan: any) => (
            <div key={loan.id} className="p-5 bg-white border rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              {/* Info Kiri */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg">{loan.borrower.name}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    loan.status === "PENDING" ? "bg-orange-100 text-orange-700" :
                    loan.status === "APPROVED" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {loan.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{loan.borrower.email} • {new Date(loan.createdAt).toLocaleDateString()}</p>
                <p className="font-semibold text-blue-600 mb-1">Nominal: Rp {loan.requestedAmount}</p>
                <p className="text-sm"><strong>Tujuan:</strong> {loan.description}</p>
                <p className="text-sm"><strong>Bukti:</strong> {loan.collateralDescription}</p>
              </div>

              {/* Tombol Kanan */}
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <a 
                  href={loan.collateralUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-100 text-gray-700 border text-center text-sm font-semibold py-2 px-4 rounded hover:bg-gray-200"
                >
                  📄 Lihat Bukti Dokumen
                </a>
                
                {loan.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(loan.id, "APPROVED")}
                      disabled={actionLoading === loan.id}
                      className="flex-1 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading === loan.id ? "..." : "✅ Terima"}
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(loan.id, "REJECTED")}
                      disabled={actionLoading === loan.id}
                      className="flex-1 bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading === loan.id ? "..." : "❌ Tolak"}
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}