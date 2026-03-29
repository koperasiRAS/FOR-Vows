import type {
  WeddingTemplate,
  PricingTier,
  AddOn,
  FeatureItem,
  TestimonialItem,
  HowItWorksStep,
  PortfolioItem,
} from "@/types";

export const templates: WeddingTemplate[] = [
  {
    id: "1",
    slug: "eternal-gold",
    name: "Eternal Gold",
    category: "luxury",
    description:
      "Undangan megah terinspirasi dari kehangatan istana berlapis emas. Gradasi emas pekat bertemu latar belakang charcoal kaya, dihiasi detail ornamental halus yang memancarkan perayaan tak lekang waktu.",
    shortDescription: "Kemewahan megah dengan aksen emas dan keanggunan bernuansa istana.",
    gradientFrom: "#1a1206",
    gradientTo: "#3d2e0f",
    accentColor: "#c9a96e",
    suitableFor: ["Pesta pernikahan besar", "Ballroom hotel", "Acara black-tie"],
    features: [
      "Nama tamu personal",
      "Manajemen RSVP",
      "Amplop hadiah digital",
      "Hitung mundur pernikahan",
      "Galeri foto",
      "Musik latar",
      "Doa dan harapan tamu",
      "Integrasi Google Maps",
      "Berbagai acara",
    ],
    featured: true,
    price: "Rp 599.000",
  },
  {
    id: "2",
    slug: "ivory-elegance",
    name: "Ivory Elegance",
    category: "luxury",
    description:
      "Bersih, halus, dan sophistication yang memukau. Palet mendominasi ivory dengan detail champagne dan emas subtil — sempurna untuk pasangan modern yang percaya kemewahan berbicara dengan lembut.",
    shortDescription: "Nuansa ivory halus dengan sentuhan emas yang menyejukkan.",
    gradientFrom: "#f5f0e8",
    gradientTo: "#e8e0d0",
    accentColor: "#c9a96e",
    suitableFor: ["Tempat jardim", "Pantai", "Perayaan minimalis"],
    features: [
      "Nama tamu personal",
      "Manajemen RSVP",
      "Hitung mundur pernikahan",
      "Galeri foto",
      "Musik latar",
      "Integrasi Google Maps",
      "Berbagai acara",
    ],
    featured: true,
    price: "Rp 599.000",
  },
  {
    id: "3",
    slug: "nusantera-heritage",
    name: "Nusantara Heritage",
    category: "adat",
    description:
      "Berakar pada kekayaan bahasa visual kepulauan Indonesia. Motif bermotif batik, warna earthy hangat, dan bingkai ornamental tradisional bersatu dalam undangan digital yang menghormati budaya.",
    shortDescription: "Motif batik yang menghormati keindahan tradisi Indonesia.",
    gradientFrom: "#2d1810",
    gradientTo: "#5c2e1a",
    accentColor: "#d4a96e",
    suitableFor: ["Upacara tradisional", "Tempat bersejarah", "Perayaan budaya"],
    features: [
      "Nama tamu personal",
      "Manajemen RSVP",
      "Hitung mundur pernikahan",
      "Galeri foto",
      "Musik latar",
      "Doa dan harapan tamu",
      "Integrasi Google Maps",
    ],
    featured: true,
    price: "Rp 299.000",
  },
  {
    id: "4",
    slug: "javanese-symphony",
    name: "Javanese Symphony",
    category: "adat",
    description:
      "Terinspirasi oleh keanggunan seni kerajaan Jawa. Undangan ini membawa keeleganan warisan Jawa — aksen bermotif wayang, garis emas yang halus, dan palet terinspirasi batu kuil dan cahaya lilin.",
    shortDescription: "Keanggunan kerajaan Jawa dengan nuansa batu kuil.",
    gradientFrom: "#1e1508",
    gradientTo: "#3a2810",
    accentColor: "#b8944a",
    suitableFor: ["Pernikahan bertema kerajaan", "Tempat bernuansa kraton", "Upacara budaya"],
    features: [
      "Nama tamu personal",
      "Manajemen RSVP",
      "Amplop hadiah digital",
      "Hitung mundur pernikahan",
      "Galeri foto",
      "Musik latar",
      "Doa dan harapan tamu",
      "Integrasi Google Maps",
      "Berbagai acara",
    ],
    featured: false,
    price: "Rp 599.000",
  },
  {
    id: "5",
    slug: "garden-terrace",
    name: "Garden Terrace",
    category: "modern",
    description:
      "Undangan kontemporer yang bernapas dengan cahaya alami. Hijau sage lembut, netral hangat, dan seni garis botanikal menciptakan pengalaman digital terbuka yang terasa hidup dan penuh kegembiraan.",
    shortDescription: "Kesegaran botanikal dengan keanggunan masa kini.",
    gradientFrom: "#1a2e1a",
    gradientTo: "#2d4a28",
    accentColor: "#8fbc8f",
    suitableFor: ["Taman terbuka", "Tempat botanikal", "Pernikahan semi dan panas"],
    features: [
      "Nama tamu personal",
      "Manajemen RSVP",
      "Hitung mundur pernikahan",
      "Galeri foto",
      "Musik latar",
      "Integrasi Google Maps",
    ],
    featured: false,
    price: "Rp 299.000",
  },
  {
    id: "6",
    slug: "minimalist-romance",
    name: "Minimalist Romance",
    category: "modern",
    description:
      "Ketika kurang menjadi segalanya. Tipografi murni, white space luas, dan satu warna aksen menciptakan undangan yang membiarkan cerita cinta Anda menjadi pusat perhatian — understated, intentional, dan mendalam.",
    shortDescription: "Tipografi murni dan white space merayakan cinta yang understated.",
    gradientFrom: "#f8f6f3",
    gradientTo: "#efe9e1",
    accentColor: "#b89a6e",
    suitableFor: ["Tempat urban", "Ruang loft", "Galeri seni kontemporer"],
    features: [
      "Nama tamu personal",
      "Manajemen RSVP",
      "Galeri foto",
      "Musik latar",
      "Integrasi Google Maps",
    ],
    featured: false,
    price: "Rp 299.000",
  },
  {
    id: "7",
    slug: "secret-garden",
    name: "Secret Garden",
    category: "intimate",
    description:
      "Atmosfer intim tersINDERap dalam bentuk digital. Nuansa burgundi pekat, bunga lembut, dan pencahayaan amber hangat menciptakan undangan yang terasa seperti ajakan berbisik pada sesuatu yang sakral dan privat.",
    shortDescription: "Intimasi cahaya lilin dengan kehangatan burgundi pekat.",
    gradientFrom: "#1e0a12",
    gradientTo: "#3a1422",
    accentColor: "#c97878",
    suitableFor: ["Upacara intim", "Estate privat", "Perayaan malam"],
    features: [
      "Nama tamu personal",
      "Manajemen RSVP",
      "Amplop hadiah digital",
      "Hitung mundur pernikahan",
      "Galeri foto",
      "Musik latar",
      "Doa dan harapan tamu",
      "Integrasi Google Maps",
    ],
    featured: true,
    price: "Rp 599.000",
  },
  {
    id: "8",
    slug: "cozy-celebration",
    name: "Cozy Celebration",
    category: "intimate",
    description:
      "Hangat, mengundang, dan penuh hati. Nuansa peach dan blush lembut berpadu dengan latar cream halus menciptakan undangan digital yang membungkus tamu dalam kehangatan perayaan Anda.",
    shortDescription: "Kehangatan blush lembut untuk pertemuan intim penuh cinta.",
    gradientFrom: "#2e1a18",
    gradientTo: "#4a2822",
    accentColor: "#c9a07a",
    suitableFor: ["Pertemuan kecil", "Perayaan di rumah", "Acara keluarga"],
    features: [
      "Nama tamu personal",
      "Manajemen RSVP",
      "Hitung mundur pernikahan",
      "Galeri foto",
      "Musik latar",
      "Integrasi Google Maps",
    ],
    featured: false,
    price: "Rp 299.000",
  },
];

export const getTemplateBySlug = (slug: string): WeddingTemplate | undefined => {
  return templates.find((t) => t.slug === slug);
};

export const getRelatedTemplates = (
  slug: string,
  category: string,
  limit = 3
): WeddingTemplate[] => {
  return templates
    .filter((t) => t.slug !== slug && t.category === category)
    .slice(0, limit);
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    price: "Rp 299.000",
    description:
      "Segala yang Anda butuhkan untuk undangan pernikahan digital yang indah dan fungsional.",
    features: [
      "1 template undangan pernikahan",
      "Nama tamu personal",
      "Manajemen RSVP",
      "Galeri foto (hingga 20 foto)",
      "Hitung mundur pernikahan",
      "Musik latar",
      "Integrasi Google Maps",
      "Desain optimal mobile",
      "Link berbagi via WhatsApp",
    ],
    highlighted: false,
  },
  {
    name: "Premium",
    price: "Rp 599.000",
    description:
      "Pilihan paling populer untuk pasangan yang menginginkan pengalaman digital yang benar-benar berkesan.",
    features: [
      "1 template undangan premium",
      "Nama tamu personal",
      "Manajemen RSVP",
      "Amplop hadiah digital (QR)",
      "Hitung mundur pernikahan",
      "Galeri foto (hingga 50 foto)",
      "Musik latar dengan kontrol",
      "Doa dan harapan tamu",
      "Integrasi Google Maps",
      "Dukungan berbagai acara",
      "Link live streaming",
      "Dukungan prioritas",
      "Aksen warna custom",
    ],
    highlighted: true,
    badge: "Paling Populer",
  },
  {
    name: "Exclusive",
    price: "Rp 999.000",
    description:
      "Undangan digital bespoke dengan kustomisasi penuh dan arahan kreatif dedicated.",
    features: [
      "Template yang didesain custom",
      "Identitas brand yang matching",
      "Nama tamu personal",
      "Manajemen RSVP",
      "Amplop hadiah digital (QR)",
      "Hitung mundur pernikahan",
      "Galeri foto (tanpa batas)",
      "Musik latar dengan kontrol",
      "Doa dan harapan tamu",
      "Integrasi Google Maps",
      "Dukungan berbagai acara",
      "Link live streaming",
      "Efek animasi premium",
      "Domain custom (1 tahun)",
      "Pengiriman kilat (48 jam)",
      "Revisi tanpa batas",
      "Creative director dedicated",
    ],
    highlighted: false,
    badge: "Bespoke",
  },
];

export const addOns: AddOn[] = [
  { name: "Domain Custom", description: "Domain sendiri untuk halaman undangan Anda", price: "Rp 150.000 per tahun" },
  { name: "Pengiriman Kilat", description: "Pengiriman 48 jam dari standar 5-7 hari", price: "Rp 100.000" },
  { name: "Animasi Premium", description: "Animasi entrance dan transisi yang elegan", price: "Rp 75.000" },
  { name: "Galeri Extra", description: "50 foto tambahan di luar batas paket", price: "Rp 50.000" },
  { name: "QR Hadiah Digital", description: "Kode QR mengarah ke rekening bank atau e-wallet", price: "Rp 25.000" },
  { name: "Link Tamu Custom", description: "Link pendek unik untuk setiap tamu atau keluarga", price: "Rp 50.000" },
];

export const features: FeatureItem[] = [
  {
    icon: "Heart",
    title: "Nama Tamu Personal",
    description: "Setiap undangan menyebutkan nama tamu Anda, menciptakan pengalaman intim dan penuh perhatian sejak sentuhan pertama.",
  },
  {
    icon: "ClipboardCheck",
    title: "RSVP Cerdas",
    description: "Manajemen RSVP yang streamline dengan preferensi makanan, jumlah kehadiran, dan update daftar tamu secara instan.",
  },
  {
    icon: "Gift",
    title: "Amplop Hadiah Digital",
    description: "Kotak hadiah digital elegan dengan kode QR yang mengarah ke rekening bank atau e-wallet pilihan Anda.",
  },
  {
    icon: "Clock",
    title: "Hitung Mundur Pernikahan",
    description: "Timer hitung mundur yang indah membangun antisipasi dari saat tamu membuka undangan.",
  },
  {
    icon: "BookOpen",
    title: "Kisah Cinta",
    description: "Bagikan timeline kisah cinta Anda, dari pertemuan pertama hingga lamaran, dengan presentasi yang indah.",
  },
  {
    icon: "Images",
    title: "Galeri Foto",
    description: "Galeri foto kurasi yang menampilkan perjalanan Anda bersama, dengan tampilan lightbox yang elegan.",
  },
  {
    icon: "MapPin",
    title: "Integrasi Maps",
    description: "Google Maps interaktif dengan arah venue, informasi parkir, dan foto tempat.",
  },
  {
    icon: "Music",
    title: "Musik Latar",
    description: "Musik ambient yang dipilih dengan cermat yang menetapkan nada emosional untuk undangan Anda.",
  },
  {
    icon: "MessageCircle",
    title: "Doa dan Harapan Tamu",
    description: "Ruang khusus bagi tamu untuk meninggalkan pesan dan harapan tulus untuk persatuan Anda.",
  },
  {
    icon: "CalendarDays",
    title: "Berbagai Acara",
    description: "Dukungan untuk akad, ceremony, resepsi, dan acara lainnya dengan jadwal dan venue masing-masing.",
  },
  {
    icon: "Video",
    title: "Live Streaming",
    description: "Link live streaming terintegrasi untuk tamu yang tidak dapat hadir secara langsung.",
  },
  {
    icon: "Smartphone",
    title: "Optimal Mobile",
    description: "Desain sempurna untuk setiap layar, dari ponsel terkecil hingga desktop terbesar.",
  },
];

export const testimonials: TestimonialItem[] = [
  {
    quote: "FOR Vows mengubah undangan kami menjadi karya seni. Tamu-tamu kami benar-benar terharu. Beberapa bilang ini undangan pernikahan paling indah yang pernah mereka terima.",
    name: "Anisa & Rizky",
    weddingDate: "Desember 2025",
    package: "Premium · Eternal Gold",
  },
  {
    quote: "Manajemen RSVP saja menghemat berminggu-minggu telepon follow-up. Semuanya terorganisir, elegan, dan mudah. Worth every rupiah.",
    name: "Dewi & Fachry",
    weddingDate: "Oktober 2025",
    package: "Premium · Ivory Elegance",
  },
  {
    quote: "Sebagai pasangan yang menginginkan sesuatu yang sangat personal, paket Exclusive melampaui imajinasi kami. Arah kreatif tim sangat impeccable.",
    name: "Sarah & Michael",
    weddingDate: "Januari 2026",
    package: "Exclusive",
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: "01",
    title: "Pilih Template Anda",
    description:
      "Jelajahi koleksi template undangan premium kami. Filter berdasarkan gaya, Luxury, Adat, Modern, atau Intimate, dan temukan yang paling sesuai dengan kisah cinta Anda.",
    icon: "Sparkles",
  },
  {
    number: "02",
    title: "Kirim Detail Anda",
    description:
      "Isi formulir brief elegan kami dengan informasi pernikahan Anda, nama, tanggal, tempat, kisah, dan foto. Tim kami menangani sisanya dengan penuh perhatian.",
    icon: "PenLine",
  },
  {
    number: "03",
    title: "Review & Setuju",
    description:
      "Terima draft personal Anda dalam 5-7 hari kerja. Minta revisi hingga setiap detail sesuai dengan visi Anda. Kami perbaiki sampai sempurna.",
    icon: "Eye",
  },
  {
    number: "04",
    title: "Lakukan Pembayaran",
    description:
      "Setelah puas dengan hasilnya, selesaikan pembayaran Anda. Kami menawarkan opsi cicilan fleksibel untuk paket Exclusive.",
    icon: "CreditCard",
  },
  {
    number: "05",
    title: "Publikasi & Bagikan",
    description:
      "Undangan digital Anda live. Terima URL unik dan link berbagi WhatsApp. Saksikan RSVP mengalir saat tamu berbagi dalam kebahagiaan Anda.",
    icon: "Share2",
  },
];

export const portfolioItems: PortfolioItem[] = [
  { id: "1", slug: "eternal-gold", title: "Eternal Gold", category: "luxury", gradientFrom: "#1a1206", gradientTo: "#3d2e0f", description: "Pesta ballroom, Jakarta" },
  { id: "2", slug: "nusantera-heritage", title: "Nusantara Heritage", category: "adat", gradientFrom: "#2d1810", gradientTo: "#5c2e1a", description: "Upacara tradisional, Yogyakarta" },
  { id: "3", slug: "secret-garden", title: "Secret Garden", category: "intimate", gradientFrom: "#1e0a12", gradientTo: "#3a1422", description: "Estate privat, Bali" },
  { id: "4", slug: "garden-terrace", title: "Garden Terrace", category: "modern", gradientFrom: "#1a2e1a", gradientTo: "#2d4a28", description: "Taman botanikal, Bandung" },
  { id: "5", slug: "ivory-elegance", title: "Ivory Elegance", category: "luxury", gradientFrom: "#f5f0e8", gradientTo: "#e8e0d0", description: "Resor tepi pantai, Lombok" },
  { id: "6", slug: "javanese-symphony", title: "Javanese Symphony", category: "adat", gradientFrom: "#1e1508", gradientTo: "#3a2810", description: "Tempat bernuansa kraton, Solo" },
  { id: "7", slug: "cozy-celebration", title: "Cozy Celebration", category: "intimate", gradientFrom: "#2e1a18", gradientTo: "#4a2822", description: "Taman rumah, Surabaya" },
  { id: "8", slug: "minimalist-romance", title: "Minimalist Romance", category: "modern", gradientFrom: "#f8f6f3", gradientTo: "#efe9e1", description: "Loft urban, Jakarta" },
];
