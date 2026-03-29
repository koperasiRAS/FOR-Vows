import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: "primary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0a0a0a]",
    gold:
      "bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a] hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]",
    outline:
      "border border-white/20 text-[#faf8f5] hover:border-white/50 hover:bg-white/5",
    ghost:
      "text-[#8a8a8a] hover:text-[#c9a96e]",
  };

  const sizes = {
    sm: "text-[11px] px-4 py-2",
    md: "text-[11px] px-6 py-3",
    lg: "text-xs px-8 py-4",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
