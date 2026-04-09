"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DonationSchema, DonationInput } from "@/schemas/donations.schema";

export default function DummyDonationPage() {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DonationInput>({
    resolver: zodResolver(DonationSchema),
  });

  const onSubmit = async (data: DonationInput) => {
    setMessage("Memproses donasi...");
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`✅ Sukses: ${result.message}`);
        reset(); // Kosongkan form setelah sukses
      } else {
        setMessage(`❌ Gagal: ${result.error || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      setMessage("❌ Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Dummy Form Donasi</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nominal Donasi */}
        <div>
          <label className="block text-sm font-semibold mb-1">Nominal Donasi (Rp)</label>
          <input
            type="number"
            {...register("amount", { valueAsNumber: true })}
            className="w-full p-2 border rounded"
            placeholder="Contoh: 50000"
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
        </div>

        {/* Metode Pembayaran */}
        <div>
          <label className="block text-sm font-semibold mb-1">Metode Pembayaran</label>
          <select {...register("paymentType")} className="w-full p-2 border rounded">
            <option value="">-- Pilih Metode --</option>
            <option value="BCA_VA">BCA Virtual Account</option>
            <option value="QRIS">QRIS</option>
          </select>
          {errors.paymentType && <p className="text-red-500 text-xs mt-1">{errors.paymentType.message}</p>}
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? "Loading..." : "Kirim Donasi"}
        </button>

        {/* Notifikasi */}
        {message && <div className="mt-4 p-3 bg-gray-100 rounded text-center text-sm font-medium">{message}</div>}
      </form>
    </div>
  );
}