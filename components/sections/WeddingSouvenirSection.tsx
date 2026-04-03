"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SOUVENIR_DESIGN } from "@/lib/constants/services";

import { formatIDR } from "@/lib/utils";

function PriceRow({ qty, price }: { qty: number; price: number }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
      <span className="text-xs text-[#8a8a8a]">{qty} pcs</span>
      <span className="text-xs text-[#c9a96e] font-medium">{formatIDR(price)}/pcs</span>
    </div>
  );
}

export function WeddingSouvenirSection() {
  const { products } = SOUVENIR_DESIGN;
  const kipas = products.find((p) => p.id === "kipas")!;
  const gantungan = products.find((p) => p.id === "gantungan_kunci")!;
  const customProduk = products.find((p) => p.id === "custom_produk")!;

  return (
    <section className="bg-[#141414] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] font-medium mb-3">
              Kenangan untuk Tamu
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#faf8f5] mb-4">
              Desain Souvenir Pernikahan
            </h2>
            <p className="text-sm text-[#8a8a8a] max-w-2xl mx-auto leading-relaxed">
              Souvenir custom dengan desain premium. Nama, tanggal, dan tema pernikahan
              Anda tercetak indah di setiap pcs.
            </p>
          </div>
        </ScrollReveal>

        {/* 3-card grid: 1 col mobile / 2 col tablet (card 3 full) / 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-5 items-stretch">

          {/* Card 1: Custom Kipas */}
          <ScrollReveal delay={0}>
            <div className="border border-white/[0.07] bg-[#0a0a0a] p-6 flex flex-col h-full">
              <div className="flex-1">
                {/* Product name */}
                <h3 className="font-serif text-xl text-[#faf8f5] mb-1">
                  {kipas.name}
                </h3>

                {/* Price range */}
                <p className="text-[10px] text-[#c9a96e] font-medium mb-5">
                  {formatIDR(kipas.priceBreaks.at(-1)!.pricePerUnit)} – {formatIDR(kipas.priceBreaks[0].pricePerUnit)}/pcs
                </p>

                <div className="h-px bg-white/[0.06] mb-5" />

                {/* Qty/price structure */}
                <div className="mb-5">
                  <p className="text-[9px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-2">
                    Struktur Harga
                  </p>
                  {kipas.priceBreaks.map((pb) => (
                    <PriceRow key={pb.quantity} qty={pb.quantity} price={pb.pricePerUnit} />
                  ))}
                </div>

                {/* Includes */}
                <div className="space-y-1.5 mb-6">
                  <p className="text-[9px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-1">
                    Includes
                  </p>
                  {kipas.includes.map((inc) => (
                    <div key={inc} className="flex items-start gap-2">
                      <span className="text-[#c9a96e] text-xs mt-0.5 shrink-0">✓</span>
                      <span className="text-xs text-[#8a8a8a] leading-relaxed">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/contact?service=souvenir"
                className="block w-full py-2.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] transition-colors text-center mt-4"
              >
                Pesan Sekarang
              </Link>
            </div>
          </ScrollReveal>

          {/* Card 2: Custom Gantungan Kunci */}
          <ScrollReveal delay={100}>
            <div className="border border-white/[0.07] bg-[#0a0a0a] p-6 flex flex-col h-full">
              <div className="flex-1">
                <h3 className="font-serif text-xl text-[#faf8f5] mb-1">
                  {gantungan.name}
                </h3>

                <p className="text-[10px] text-[#c9a96e] font-medium mb-5">
                  {formatIDR(gantungan.priceBreaks.at(-1)!.pricePerUnit)} – {formatIDR(gantungan.priceBreaks[0].pricePerUnit)}/pcs
                </p>

                <div className="h-px bg-white/[0.06] mb-5" />

                <div className="mb-5">
                  <p className="text-[9px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-2">
                    Struktur Harga
                  </p>
                  {gantungan.priceBreaks.map((pb) => (
                    <PriceRow key={pb.quantity} qty={pb.quantity} price={pb.pricePerUnit} />
                  ))}
                </div>

                <div className="space-y-1.5 mb-6">
                  <p className="text-[9px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-1">
                    Includes
                  </p>
                  {gantungan.includes.map((inc) => (
                    <div key={inc} className="flex items-start gap-2">
                      <span className="text-[#c9a96e] text-xs mt-0.5 shrink-0">✓</span>
                      <span className="text-xs text-[#8a8a8a] leading-relaxed">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/contact?service=souvenir"
                className="block w-full py-2.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] transition-colors text-center mt-4"
              >
                Pesan Sekarang
              </Link>
            </div>
          </ScrollReveal>

          {/* Card 3: Custom Produk Lainnya — full width on tablet */}
          <ScrollReveal delay={200}>
            <div className="border border-[#c9a96e]/20 bg-[#0f0f0f] p-6 flex flex-col h-full md:col-span-2 lg:col-span-1">
              <div className="flex-1">
                {/* Badge */}
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#c9a96e] mb-3">
                  Custom Request
                </p>

                <h3 className="font-serif text-xl text-[#faf8f5] mb-1">
                  {customProduk.name}
                </h3>

                <p className="text-[10px] text-[#c9a96e] font-medium mb-5">
                  {customProduk.tagline} · Mulai dari {formatIDR(customProduk.priceBreaks[0].pricePerUnit)}/pcs
                </p>

                <div className="h-px bg-white/[0.06] mb-5" />

                {/* Contoh produk chips */}
                <div className="mb-5">
                  <p className="text-[9px] tracking-[0.15em] uppercase text-[#6a6a6a] mb-2">
                    Contoh Produk
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {customProduk.includes
                      .join(" ")
                      .split(", ")
                      .map((item) => (
                        <span
                          key={item}
                          className="text-[10px] px-2.5 py-1 border border-white/10 text-[#8a8a8a]"
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Catatan */}
                <p className="text-xs text-[#6a6a6a] leading-relaxed mb-6 italic">
                  Hubungi kami untuk penawaran harga dan detail custom order Anda.
                </p>
              </div>

              <Link
                href="/contact?service=souvenir"
                className="block w-full py-2.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] transition-colors text-center mt-4"
              >
                Konsultasi Gratis
              </Link>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
