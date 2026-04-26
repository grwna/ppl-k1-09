"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabaseClient as supabase } from "@/lib/supabase-client";

// Kita buat schema khusus frontend tanpa collateralUrl (karena diganti input file)
const FrontendLoanSchema = z.object({
  requestedAmount: z.number().positive("Nominal pinjaman harus lebih dari 0"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  collateralDescription: z.string().min(5, "Deskripsi bukti wajib diisi"),
});

type FrontendLoanInput = z.infer<typeof FrontendLoanSchema>;

export default function DummyLoanPage() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FrontendLoanInput>({
    resolver: zodResolver(FrontendLoanSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: FrontendLoanInput) => {
    if (!file) {
      setMessage("❌ Harap unggah dokumen bukti terlebih dahulu.");
      return;
    }

    setMessage("⏳ Mengunggah dokumen ke Supabase...");
    
    try {
      // 1. Proses Upload File ke Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `bukti/${fileName}`; // Folder bukti di dalam bucket dokumen

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("dokumen") // Nama bucket yang kita buat di Langkah 1
        .upload(filePath, file);

      if (uploadError) throw new Error(`Gagal upload: ${uploadError.message}`);

      // 2. Ambil Public URL dari Supabase
      const { data: publicUrlData } = supabase.storage
        .from("dokumen")
        .getPublicUrl(filePath);

      const uploadedUrl = publicUrlData.publicUrl;

      // 3. Gabungkan data form dengan URL dokumen, lalu tembak API Backend
      setMessage("⏳ Menyimpan data pengajuan pinjaman...");
      
      const payloadToBackend = {
        ...data,
        collateralUrl: uploadedUrl, // Masukkan URL hasil upload
      };

      const response = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToBackend),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Sukses: ${result.message}`);
        reset(); // Bersihkan form text
        setFile(null); // Bersihkan file
        // Reset input file secara manual
        (document.getElementById("file-upload") as HTMLInputElement).value = "";
      } else {
        setMessage(`❌ Gagal: ${result.error || "Terjadi kesalahan"}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Dummy Pengajuan Pinjaman (Upload)</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Nominal Pinjaman (Rp)</label>
          <input
            type="number"
            {...register("requestedAmount", { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          {errors.requestedAmount && <p className="text-red-500 text-xs mt-1">{errors.requestedAmount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Alasan / Tujuan Pinjaman</label>
          <textarea
            {...register("description")}
            className="w-full p-2 border rounded"
            rows={3}
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Deskripsi Dokumen Bukti</label>
          <input
            type="text"
            {...register("collateralDescription")}
            className="w-full p-2 border rounded"
            placeholder="Contoh: Bukti penagihan UKT Felix Semester 6"
          />
          {errors.collateralDescription && <p className="text-red-500 text-xs mt-1">{errors.collateralDescription.message}</p>}
        </div>

        {/* INPUT FILE UNTUK UPLOAD */}
        <div className="p-4 border-2 border-dashed rounded bg-gray-50">
          <label className="block text-sm font-semibold mb-2">Unggah Dokumen (PDF / JPG / PNG)</label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf, image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Sedang Memproses..." : "Ajukan Pinjaman & Unggah Dokumen"}
        </button>

        {message && <div className="mt-4 p-3 bg-gray-100 rounded text-center text-sm font-medium">{message}</div>}
      </form>
    </div>
  );
}