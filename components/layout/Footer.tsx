import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Layanan: [
    { href: "/templates", label: "Template" },
    { href: "/pricing", label: "Harga" },
    { href: "/features", label: "Fitur" },
    { href: "/contact", label: "Pesan Custom" },
  ],
  Perusahaan: [
    { href: "/about", label: "Tentang FOR Vows" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/how-it-works", label: "Cara Pesan" },
  ],
  Lainnya: [
    { href: "/contact", label: "Hubungi Kami" },
    { href: "https://instagram.com/frameofrangga", label: "Instagram" },
    { href: "https://www.tiktok.com/@madebyrangga", label: "TikTok" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.06]">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-5">
            <Link href="/" className="block">
              <div className="relative h-10 w-auto">
                <Image
                  src="/images/logo-brand.png"
                  alt="FOR Vows"
                  width={130}
                  height={36}
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-[#5a5a5a] leading-relaxed max-w-xs">
              Merek undangan pernikahan digital premium dari{" "}
              <a
                href="https://for-portofolio.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8a8a8a] hover:text-[#c9a96e] transition-colors"
              >
                Frame Of Rangga
              </a>
              . Menciptakan momen sakral menjadi pengalaman digital yang tak terlupakan.
            </p>
            <p className="text-xs text-[#c9a96e] tracking-[0.1em] italic font-accent">
              &ldquo;Crafting Your Sacred Moments&rdquo;
            </p>
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://instagram.com/frameofrangga"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5a5a5a] hover:text-[#c9a96e] transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@madebyrangga"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5a5a5a] hover:text-[#c9a96e] transition-colors duration-300"
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.86a8.17 8.17 0 0 0 4.77 1.52V6.68a4.85 4.85 0 0 1-1-.0z"/>
                </svg>
              </a>
              <a
                href="mailto:hello@forvows.com"
                className="text-[#5a5a5a] hover:text-[#c9a96e] transition-colors duration-300"
                aria-label="Email"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] font-medium">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-[#5a5a5a] hover:text-[#c9a96e] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#3a3a3a]">
            &copy; {new Date().getFullYear()} FOR Vows. Sub-brand dari Frame Of Rangga. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-[#3a3a3a]">
            Premium Digital Wedding Invitations
          </p>
        </div>
      </div>
    </footer>
  );
}
