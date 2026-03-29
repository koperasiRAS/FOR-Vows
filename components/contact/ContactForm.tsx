"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry } from "@/app/actions/submitInquiry";
import type { ContactFormData } from "@/types";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data: ContactFormData = {
      fullName: formData.get("fullName") as string,
      partnerName: formData.get("partnerName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      weddingDate: formData.get("weddingDate") as string,
      serviceType: formData.get("serviceType") as string,
      packageName: formData.get("packageName") as string,
      templateName: formData.get("templateName") as string,
      message: formData.get("message") as string,
    };

    const result = await submitInquiry(data);

    if (result.success) {
      setStatus("success");
      e.currentTarget.reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-16 px-8 border border-[#c9a96e]/30 bg-[#0f0f0f]">
        <CheckCircle size={40} className="text-[#c9a96e]" />
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-[#faf8f5]">Terima Kasih</h3>
          <p className="text-sm text-[#8a8a8a] max-w-sm">
            Pertanyaan Anda sudah diterima. Tim kami akan menghubungi dalam 24
            jam untuk mendiskusikan visi Anda.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setStatus("idle")}
          className="mt-2"
        >
          Kirim Pertanyaan Lain
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
    >
      {/* Row: Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
            Nama Anda <span className="text-[#c9a96e]">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Nama lengkap"
            required
            className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50 focus:ring-[#c9a96e]/10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="partnerName" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
            Nama Pasangan
          </Label>
          <Input
            id="partnerName"
            name="partnerName"
            placeholder="Nama lengkap pasangan"
            className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50 focus:ring-[#c9a96e]/10"
          />
        </div>
      </div>

      {/* Row: Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
            Email <span className="text-[#c9a96e]">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@contoh.com"
            required
            className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
            WhatsApp / Telepon
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+62 xxx xxxx xxxx"
            className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50"
          />
        </div>
      </div>

      {/* Row: Wedding Date */}
      <div className="space-y-1.5">
        <Label htmlFor="weddingDate" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
          Tanggal Pernikahan
        </Label>
        <Input
          id="weddingDate"
          name="weddingDate"
          type="date"
          className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] text-sm focus:border-[#c9a96e]/50 [color-scheme:dark]"
        />
      </div>

      {/* Row: Service + Package */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
            Layanan yang Dibutuhkan
          </Label>
          <select
            name="serviceType"
            className="w-full h-10 px-3 text-sm bg-[#0f0f0f] border border-white/10 text-[#faf8f5] rounded-md focus:border-[#c9a96e]/50 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]/20"
            defaultValue=""
          >
            <option value="" disabled className="text-[#4a4a4a]">Pilih layanan</option>
            <option value="digital_invitation">Undangan Pernikahan Digital</option>
            <option value="wedding_website">Website Pernikahan</option>
            <option value="custom_design">Desain Custom</option>
            <option value="other">Lainnya</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
            Minat Paket
          </Label>
          <select
            name="packageName"
            className="w-full h-10 px-3 text-sm bg-[#0f0f0f] border border-white/10 text-[#faf8f5] rounded-md focus:border-[#c9a96e]/50 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]/20"
            defaultValue=""
          >
            <option value="" disabled className="text-[#4a4a4a]">Pilih paket</option>
            <option value="basic">Basic — Rp 299.000</option>
            <option value="premium">Premium — Rp 599.000</option>
            <option value="exclusive">Exclusive — Rp 999.000</option>
            <option value="undecided">Belum memutuskan</option>
          </select>
        </div>
      </div>

      {/* Template */}
      <div className="space-y-1.5">
        <Label htmlFor="templateName" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
          Template yang Diminati
        </Label>
        <Input
          id="templateName"
          name="templateName"
          placeholder="contoh: Eternal Gold, Nusantara Heritage..."
          className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50"
        />
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
          Pesan <span className="text-[#c9a96e]">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Ceritakan tentang pernikahan Anda, visi, dan kebutuhan khusus..."
          required
          rows={5}
          className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50 resize-none"
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={14} />
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full tracking-[0.2em]"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <Loader size={14} className="animate-spin" />
            Mengirim...
          </span>
        ) : (
          "Kirim Pertanyaan"
        )}
      </Button>
    </form>
  );
}
