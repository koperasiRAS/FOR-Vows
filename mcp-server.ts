import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

// Resolusi path aman untuk ES Modules yang dijalankan via tsx dari command line Claude Desktop
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Memuat environment variables dari .env.local
dotenv.config({ path: path.join(__dirname, ".env.local") });

// Konfigurasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("FATAL ERROR: Kredensial Supabase (URL atau KEY) tidak ditemukan di .env.local!");
  process.exit(1);
}

// Gunakan Supabase JS SDK murni layaknya server-side code
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Inisialisasi Server MCP Vows
const server = new Server(
  {
    name: "for-vows-agent",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 2. Mendaftarkan 3 Tools Sakti ke Claude (Sesuai Implementation Plan)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "check_order_status",
        description: "Mengecek detail pesanan kustomer FOR Vows terbaru dari database.",
        inputSchema: {
          type: "object",
          properties: {
            order_code: {
              type: "string",
              description: "Kode unik pesanan, misalnya FORV-2026...",
            },
          },
          required: ["order_code"],
        },
      },
      {
        name: "get_recent_inquiries",
        description: "Mengambil 5 pertanyaan kontak / lead form terbaru dari calon kustomer.",
        inputSchema: {
          type: "object",
          properties: {
             limit: {
                type: "number",
                description: "Maksimal data terbaru yang ingin diambil (default: 5)"
             }
          },
        },
      },
      {
        name: "update_order_status",
        description: "UPDATE status pengerjaan spesifik dari pesanan. Status Valid: 'pending', 'paid', 'processing', 'completed', 'cancelled'",
        inputSchema: {
          type: "object",
          properties: {
            order_code: {
               type: "string",
               description: "Kode unik pesanan kustomer"
            },
            new_status: {
               type: "string",
               description: "Status spesifik yang akan diterapkan menurut skema DB",
               enum: ['pending', 'paid', 'processing', 'completed', 'cancelled']
            }
          },
          required: ["order_code", "new_status"],
        },
      }
    ],
  };
});

// 3. Menangani Eksekusi Logika Supabase ketika Tools di atas dipanggil
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "check_order_status") {
      const orderCode = String(args?.order_code).trim();
      
      const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_code", orderCode)
        .single();

      if (error || !order) {
        return {
          content: [{ type: "text", text: `Pesanan dengan kode '${orderCode}' tidak ditemukan di database. Pastikan mengetikkan kode yang tepat.` }]
        };
      }

      // Format detail laporan
      const detailReport = `Detail Pesanan FOR Vows [${orderCode}]:
- Status Pengerjaan: ${order.status.toUpperCase()}
- Pasangan Pengantin: ${order.groom_name} & ${order.bride_name}
- Template Pilihan: ${order.template} (${order.package_name})
- Total Harga: Rp ${order.final_total || order.total_price}
- Nomor HP/WhatsApp: ${order.phone}
- Tanggal Pernikahan: ${order.wedding_date || 'Belum Ditentukan'}`;

      return {
        content: [{ type: "text", text: detailReport }]
      };
    }

    else if (name === "get_recent_inquiries") {
      const limit = Number(args?.limit) || 5;
      
      const { data: inquiries, error } = await supabase
          .from("inquiries")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);

      if (error || !inquiries || inquiries.length === 0) {
          return {
            content: [{ type: "text", text: "Tidak ditemukan Lead Inquiries apapun dari form kontak." }]
          }
      }

      const reportList = inquiries.map((i, index) => {
          return `${index + 1}. [${i.status.toUpperCase()}] Tgl Acara: ${i.wedding_date || '?'}
   Nama: ${i.full_name} 
   Kontak: ${i.email} | ${i.phone || 'N/A'}
   Kebutuhan: ${i.service_type || i.package_name || '-'}
   Pesan Masuk: "${i.message}"`;
      }).join('\n\n');
      
      return {
          content: [{ type: "text", text: `🔥 Daftar ${inquiries.length} Inquiries (Lead Kustomer) Terbaru FOR Vows:\n\n${reportList}` }]
      }
    }

    else if (name === "update_order_status") {
      const orderCode = String(args?.order_code).trim();
      const newStatus = String(args?.new_status).toLowerCase().trim();
      
      const { data: updated, error } = await supabase
          .from("orders")
          .update({ status: newStatus })
          .eq("order_code", orderCode)
          .select("id, status, groom_name, bride_name")
          .single();
          
      if (error) {
          return {
              content: [{ type: "text", text: `Gagal memperbarui database untuk order. Error Database: ${error.message}` }]
          };
      }
      if (!updated) {
          return {
              content: [{ type: "text", text: `Operasi ditolak. Pesanan dengan kode ${orderCode} tidak ditemukan di baris data manapun.` }]
          };
      }

      return {
          content: [{ type: "text", text: `✅ SUKSES MUTASI! Pesanan ${orderCode} (${updated.groom_name} & ${updated.bride_name}) telah berhasil diperbarui ke status: ${updated.status.toUpperCase()}` }]
      };
    }

    // Jika Claude mencoba tool lain yang tidak ada
    throw new Error(`Tool (skill) [${name}] tidak dikenali oleh system Vows.`);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
       content: [{ type: "text", text: `Terjadi error internal aplikasi: ${errorMessage}` }]
    }
  }
});

// 4. Hubungkan dan Jalankan Server via STDIO agar terbaca Client MCP (Claude)
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 FOR Vows Custom MCP Server & Database Engine Berhasil Menyala dan Tersambung!");
}

main().catch((error) => {
  console.error("Critical Error pada proses inisiasi MCP:", error);
  process.exit(1);
});
