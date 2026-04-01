# FOR Vows — Project Context

## Stack

- Next.js 16.2.1 (App Router)
- React 19
- TypeScript (strict mode)
- Supabase (Auth + Database + Storage)
- Midtrans (payment gateway, sandbox mode)
- Tailwind v4
- shadcn/ui + @base-ui/react
- Zod untuk validation
- React Hook Form

## Auth Architecture

- Customer auth: /auth/login, /auth/register → akses /dashboard, /orders
- Admin auth: /admin/login → akses /admin/\* (butuh role "admin" di app_metadata)
- Middleware di middleware.ts menghandle semua route protection
- Gunakan selalu `supabase.auth.getUser()`, BUKAN `getSession()`

## File Structure Penting

- app/layout.tsx — Root layout (hati-hati, CartSidebar ada di sini)
- app/auth/layout.tsx — Auth-specific layout (tanpa cart)
- app/admin/layout.tsx — Admin-specific layout (tanpa customer cart)
- middleware.ts — Route protection logic
- lib/supabase.ts — Supabase client helpers
- supabase/migrations/ — Database schema

## Conventions

- Server components by default, tambahkan 'use client' hanya jika perlu
- Semua API routes di app/api/\*/route.ts
- Environment variables: NEXT*PUBLIC*\* untuk client, sisanya server-only
- Gunakan Zod untuk semua input validation di API routes

## Yang TIDAK boleh dilakukan:

- Jangan expose SUPABASE_SERVICE_ROLE_KEY ke client
- Jangan buat halaman publik untuk create admin
- Jangan ubah Midtrans mode (sandbox/production) — itu di .env
