"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry } from "@/app/actions/submitInquiry";
import { useLanguage } from "@/lib/i18n/context";
import type { ContactFormData } from "@/types";

export function ContactForm() {
  const { t } = useLanguage();
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
      setErrorMsg(result.error || t("contact.terjadiError"));
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-16 px-8 border border-[#c9a96e]/30 bg-[#0f0f0f]">
        <CheckCircle size={40} className="text-[#c9a96e]" />
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-[#faf8f5]">{t("contact.terimaKasih")}</h3>
          <p className="text-sm text-[#8a8a8a] max-w-sm">
            {t("contact.suksesPertanyaan")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setStatus("idle")}
          className="mt-2"
        >
          {t("contact.kirimPertanyaanLain")}
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
            {t("contact.namaAnda")} <span className="text-[#c9a96e]">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder={t("contact.namaPlaceholder")}
            required
            className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50 focus:ring-[#c9a96e]/10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="partnerName" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
            {t("contact.namaPasangan")}
          </Label>
          <Input
            id="partnerName"
            name="partnerName"
            placeholder={t("contact.pasanganPlaceholder")}
            className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50 focus:ring-[#c9a96e]/10"
          />
        </div>
      </div>

      {/* Row: Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
            {t("contact.email")} <span className="text-[#c9a96e]">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("contact.emailPlaceholder")}
            required
            className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
            {t("contact.whatsappTelepon")}
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder={t("contact.waPlaceholder")}
            className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50"
          />
        </div>
      </div>

      {/* Row: Wedding Date */}
      <div className="space-y-1.5">
        <Label htmlFor="weddingDate" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
          {t("contact.tanggalPernikahan")}
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
            {t("contact.layananDibutuhkan")}
          </Label>
          <select
            name="serviceType"
            className="w-full h-10 px-3 text-sm bg-[#0f0f0f] border border-white/10 text-[#faf8f5] rounded-md focus:border-[#c9a96e]/50 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]/20"
            defaultValue=""
          >
            <option value="" disabled className="text-[#4a4a4a]">{t("contact.pilihLayanan")}</option>
            <option value="digital_invitation">{t("contact.undanganDigital")}</option>
            <option value="wedding_website">{t("contact.websitePernikahan")}</option>
            <option value="custom_design">{t("contact.desainCustom")}</option>
            <option value="other">{t("contact.lainnya")}</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
            {t("contact.minatPaket")}
          </Label>
          <select
            name="packageName"
            className="w-full h-10 px-3 text-sm bg-[#0f0f0f] border border-white/10 text-[#faf8f5] rounded-md focus:border-[#c9a96e]/50 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]/20"
            defaultValue=""
          >
            <option value="" disabled className="text-[#4a4a4a]">{t("contact.pilihPaket")}</option>
            <option value="basic">{t("contact.basic")}</option>
            <option value="premium">{t("contact.premium")}</option>
            <option value="exclusive">{t("contact.exclusive")}</option>
            <option value="undecided">{t("contact.belumMemutuskan")}</option>
          </select>
        </div>
      </div>

      {/* Template */}
      <div className="space-y-1.5">
        <Label htmlFor="templateName" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
          {t("contact.templateDiminati")}
        </Label>
        <Input
          id="templateName"
          name="templateName"
          placeholder={t("contact.templatePlaceholder")}
          className="bg-[#0f0f0f] border-white/10 text-[#faf8f5] placeholder:text-[#4a4a4a] text-sm focus:border-[#c9a96e]/50"
        />
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-[11px] tracking-[0.1em] uppercase text-[#8a8a8a]">
          {t("contact.pesan")} <span className="text-[#c9a96e]">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t("contact.pesanPlaceholder")}
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
            {t("contact.sedangMengirim")}
          </span>
        ) : (
          t("contact.kirimPertanyaan")
        )}
      </Button>
    </form>
  );
}
