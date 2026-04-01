export function TemplateCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.06] animate-pulse">
      <div className="aspect-[3/4] bg-[#1a1a1a]" />
      <div className="p-4 space-y-2.5 bg-[#0f0f0f]">
        <div className="h-2.5 bg-[#1a1a1a] rounded w-16" />
        <div className="h-4 bg-[#1a1a1a] rounded w-2/3" />
        <div className="h-3 bg-[#1a1a1a] rounded w-full" />
        <div className="h-3 bg-[#1a1a1a] rounded w-3/4" />
      </div>
    </div>
  );
}

export function PortfolioCardSkeleton() {
  return <div className="aspect-[3/4] rounded-xl bg-[#1a1a1a] animate-pulse" />;
}
