import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
      <div className="relative animate-pulse">
        <Image
          src="/Logo Brand/Loading Logo Brand.png"
          alt="Loading FOR Vows..."
          width={120}
          height={120}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
