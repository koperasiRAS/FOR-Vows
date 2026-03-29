import Link from "next/link";
import * as LucideIcons from "lucide-react";

const footerLinks = {
  Services: [
    { href: "/templates", label: "Templates" },
    { href: "/pricing", label: "Pricing" },
    { href: "/features", label: "Features" },
    { href: "/contact", label: "Custom Order" },
  ],
  Company: [
    { href: "/about", label: "About FOR Vows" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/how-it-works", label: "How It Works" },
  ],
  Connect: [
    { href: "/contact", label: "Contact Us" },
    { href: "https://instagram.com", label: "Instagram" },
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
            <div className="flex items-center gap-1">
              <span className="font-serif text-lg tracking-[0.2em] text-[#faf8f5]">
                FOR
              </span>
              <span className="font-serif italic text-lg tracking-[0.15em] text-[#c9a96e]">
                Vows
              </span>
            </div>
            <p className="text-sm text-[#5a5a5a] leading-relaxed max-w-xs">
              A premium digital wedding invitation brand by{" "}
              <span className="text-[#8a8a8a]">Frame Of Rangga</span>. Crafting
              sacred moments into timeless digital experiences.
            </p>
            <p className="text-xs text-[#c9a96e] tracking-[0.1em] italic font-accent">
              &ldquo;Crafting Your Sacred Moments&rdquo;
            </p>
            <div className="flex gap-4 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5a5a5a] hover:text-[#c9a96e] transition-colors duration-300"
                aria-label="Instagram"
              >
                <LucideIcons.Instagram size={18} />
              </a>
              <a
                href="mailto:hello@forvows.com"
                className="text-[#5a5a5a] hover:text-[#c9a96e] transition-colors duration-300"
                aria-label="Email"
              >
                <LucideIcons.Mail size={18} />
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
                    <Link
                      href={link.href}
                      className="text-sm text-[#5a5a5a] hover:text-[#c9a96e] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
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
            &copy; {new Date().getFullYear()} FOR Vows. A sub-brand of Frame Of
            Rangga. All rights reserved.
          </p>
          <p className="text-xs text-[#3a3a3a]">
            Premium Digital Wedding Invitations
          </p>
        </div>
      </div>
    </footer>
  );
}
