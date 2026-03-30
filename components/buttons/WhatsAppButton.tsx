"use client";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const WA_BTN_CLASS =
  "flex items-center justify-center gap-2 w-full py-4 text-[11px] tracking-widest uppercase bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

interface BaseProps {
  label: string;
  size?: number;
  className?: string;
}

interface ButtonProps extends BaseProps {
  as?: "button";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

interface AnchorProps extends BaseProps {
  as: "a";
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

type WhatsAppButtonProps = ButtonProps | AnchorProps;

/**
 * Reusable WhatsApp-branded button/anchor.
 * Eliminates 10+ copies of the same Tailwind class string across cart components.
 *
 * Usage (button):
 *   <WhatsAppButton label="Pesan Sekarang" onClick={handleClick} />
 *
 * Usage (anchor):
 *   <WhatsAppButton as="a" href="https://wa.me/..." label="Hubungi Admin" target="_blank" />
 */
export function WhatsAppButton(props: WhatsAppButtonProps) {
  const { label, size = 16, className = "" } = props;
  const combinedClass = `${WA_BTN_CLASS} ${className}`.trim();

  if (props.as === "a") {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        className={combinedClass}
      >
        <WhatsAppIcon size={size} />
        {label}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={combinedClass}
    >
      <WhatsAppIcon size={size} />
      {label}
    </button>
  );
}
