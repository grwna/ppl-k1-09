"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { 
  User, 
  Mail, 
  IdCard, 
  Phone, 
  MapPin, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  Coins, 
  FileCheck2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import AdminDashboard_AdminNavbar from "@/components/ui/admin-dashboard/admin_navbar";
import { AdminSearch } from "@/components/ui/admin-search";
import { useToast } from "@/components/ui/toast";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type UserRole = "DONOR" | "BORROWER" | "ADMIN";

type UserItem = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  profile: {
    nik: string | null;
    phoneNumber: string | null;
    address: string | null;
  };
  verification: {
    isVerified: boolean;
    verifiedAt: string | null;
    documents: {
      hasIdentityCard: boolean;
      hasInstitutionCard: boolean;
      hasFamilyCard: boolean;
    };
  };
  roles: UserRole[];
  activitySummary: {
    totalFundingsCreated: number;
    totalLoanApplicationsCreated: number;
  };
};

type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

const VERIFICATION_FILTERS = [
  { label: "Semua Pengguna", value: null },
  { label: "Terverifikasi", value: "true" },
  { label: "Belum Terverifikasi", value: "false" },
];

const roleBadgeClassName: Record<UserRole, string> = {
  DONOR: "bg-[#F0FBFD] text-[#07B0C8]",
  BORROWER: "bg-[#FFF8E8] text-[#FCB82E]",
  ADMIN: "bg-purple-50 text-purple-700",
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function ProfileDetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
}) {
  const hasValue = Boolean(value?.trim());

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${hasValue ? "bg-[#F0FBFD] text-[#07B0C8]" : "bg-gray-50 text-gray-400"}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-gray-500">{label}</div>
          <div className={`mt-1 wrap-break-word text-sm font-bold ${hasValue ? "text-slate-800" : "text-gray-400 italic"}`}>
            {hasValue ? value : "Tidak ada data"}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricTile({ 
  icon, 
  label, 
  count, 
  colorClass 
}: { 
  icon: ReactNode; 
  label: string; 
  count: number;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-2xs">
      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${colorClass}`}>
        {icon}
      </div>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</div>
        <div className="text-base font-extrabold text-slate-800">{count}</div>
      </div>
    </div>
  );
}

export default function AdminUsersManagementPage() {
  const toast = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, limit: 10, totalItems: 0, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isVerifiedFilter, setIsVerifiedFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const fetchUsers = useCallback(async (
    page: number,
    verifiedStatus: string | null,
    role: string | null,
    searchQuery = "",
    signal?: AbortSignal
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (verifiedStatus !== null) params.set("isVerified", verifiedStatus);
      if (role !== null) params.set("role", role);
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`/api/admin/users?${params}`, {
        cache: "no-store",
        signal,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Gagal memuat data pengguna");

      setUsers(payload.data || []);
      setPagination(payload.pagination);
    } catch (fetchError) {
      if (!(fetchError instanceof DOMException && fetchError.name === "AbortError")) {
        setError(fetchError instanceof Error ? fetchError.message : "Gagal memuat data pengguna");
      }
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  // Reset page to 1 when filters or search fields mutate
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, isVerifiedFilter, roleFilter]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchUsers(currentPage, isVerifiedFilter, roleFilter, debouncedSearch, controller.signal);
    return () => controller.abort();
  }, [currentPage, debouncedSearch, fetchUsers, isVerifiedFilter, roleFilter]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900">
      <AdminDashboard_AdminNavbar />

      <main className="mx-auto w-full max-w-350 px-4 py-6 sm:px-6 sm:py-10">
        {/* Header Area */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1E293B] sm:text-4xl">Daftar Pengguna</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Manajemen seluruh basis pengguna platform. Pantau data identitas profil, kelola hak akses role, serta rangkuman riwayat keaktifan sistem.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchUsers(currentPage, isVerifiedFilter, roleFilter, debouncedSearch)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {/* Filter Navigation Tabs and Core Search Bar */}
        <div className="mt-6 flex flex-col gap-4 border-b border-gray-200 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 gap-2 overflow-x-auto no-scrollbar -mb-px">
            {VERIFICATION_FILTERS.map((filter) => {
              const isActive = isVerifiedFilter === filter.value;
              return (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setIsVerifiedFilter(filter.value)}
                  className={`whitespace-nowrap border-b-2 px-4 pb-3 text-sm font-bold transition ${isActive ? "border-[#07B0C8] text-[#07B0C8]" : "border-transparent text-gray-500 hover:text-slate-800"}`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <AdminSearch
            value={search}
            onChange={setSearch}
            placeholder="Cari nama, email, NIK, atau nomor telepon pengguna..."
            className="mb-3 w-full md:max-w-md"
          />
        </div>

        {/* Dynamic Secondary Role Multi-filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">Filter Role:</span>
          {[
            { label: "Semua Role", value: null },
            { label: "Donatur", value: "DONOR" },
            { label: "Peminjam", value: "BORROWER" },
            { label: "Admin", value: "ADMIN" }
          ].map((r) => {
            const isSelected = roleFilter === r.value;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => setRoleFilter(r.value)}
                className={`inline-flex h-8 items-center justify-center rounded-full px-3 text-xs font-bold transition ${
                  isSelected
                    ? "bg-slate-800 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Status Messaging Panels */}
        {error && (
          <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-8 text-sm font-semibold text-gray-500">
            Memuat data daftar pengguna platform...
          </div>
        )}

        {!isLoading && users.length === 0 && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-10 text-center text-sm font-semibold text-gray-500">
            Tidak ditemukan record pengguna yang cocok dengan kriteria filter ini.
          </div>
        )}

        {/* Users Article Feed Cards */}
        <div className="mt-6 grid gap-5">
          {!isLoading && users.map((user) => (
            <article key={user.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  {/* Title & Badges Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <User size={18} className="text-slate-400 shrink-0" />
                      {user.name}
                    </h2>
                    
                    {/* User Verification Status Badges */}
                    {user.verification.isVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        <ShieldCheck size={12} /> Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-500">
                        <ShieldAlert size={12} /> Belum Verifikasi
                      </span>
                    )}

                    {/* Array mapping dynamic Platform System Roles */}
                    {user.roles.map((role) => (
                      <span key={role} className={`rounded-full px-2.5 py-1 text-xs font-bold ${roleBadgeClassName[role] || "bg-gray-100 text-gray-700"}`}>
                        {role}
                      </span>
                    ))}
                  </div>

                  {/* Mail & Timing References */}
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} /> {user.email}
                      {user.emailVerified && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-sm font-bold">Verified</span>}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs font-medium text-gray-400 sm:grid-cols-2">
                    <span>Terdaftar akun: {formatDate(user.createdAt)}</span>
                    {user.verification.isVerified && (
                      <span>Disetujui verifikasi: {formatDate(user.verification.verifiedAt)}</span>
                    )}
                  </div>

                  {/* Documents Presence Summary Row */}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className={`rounded-md px-2 py-1 border ${user.verification.documents.hasIdentityCard ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-600"}`}>
                      {user.verification.documents.hasIdentityCard ? "✓ KTP Terunggah" : "✗ KTP Kosong"}
                    </span>
                    <span className={`rounded-md px-2 py-1 border ${user.verification.documents.hasInstitutionCard ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-gray-100 bg-gray-50 text-gray-400"}`}>
                      {user.verification.documents.hasInstitutionCard ? "✓ ID Lembaga" : "ID Lembaga Kosong"}
                    </span>
                    <span className={`rounded-md px-2 py-1 border ${user.verification.documents.hasFamilyCard ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-gray-100 bg-gray-50 text-gray-400"}`}>
                      {user.verification.documents.hasFamilyCard ? "✓ Kartu Keluarga" : "KK Kosong"}
                    </span>
                  </div>
                </div>

                {/* Aggregated Business Operations Metrics Column */}
                <div className="grid grid-cols-2 gap-2 shrink-0 sm:w-80 lg:w-72">
                  <MetricTile 
                    icon={<Coins size={15} />} 
                    label="Pendanaan" 
                    count={user.activitySummary.totalFundingsCreated} 
                    colorClass="bg-cyan-50 text-cyan-600"
                  />
                  <MetricTile 
                    icon={<FileCheck2 size={15} />} 
                    label="Pinjaman" 
                    count={user.activitySummary.totalLoanApplicationsCreated} 
                    colorClass="bg-amber-50 text-amber-600"
                  />
                </div>
              </div>

              {/* Core Profiling Section */}
              <div className="mt-5 rounded-lg border border-gray-200 bg-[#F8FAFC] p-4">
                <div className="text-sm font-bold text-slate-900">Detail Profil Informasi</div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <ProfileDetailItem icon={<IdCard size={17} />} label="NIK Identitas" value={user.profile.nik} />
                  <ProfileDetailItem icon={<Phone size={17} />} label="No. Handphone" value={user.profile.phoneNumber} />
                  <ProfileDetailItem icon={<MapPin size={17} />} label="Alamat Domisili" value={user.profile.address} />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Semantic Component Footer Pagination Controls */}
        {!isLoading && pagination.totalPages > 1 && (
          <footer className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="text-sm font-medium text-gray-500">
              Menampilkan <span className="font-bold text-slate-800">{users.length}</span> dari{" "}
              <span className="font-bold text-slate-800">{pagination.totalItems}</span> pengguna
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="text-sm font-bold text-slate-700 px-2">
                Halaman {pagination.page} dari {pagination.totalPages}
              </div>
              <button
                type="button"
                disabled={currentPage === pagination.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}