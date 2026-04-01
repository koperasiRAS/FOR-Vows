-- FOR Vows: Script untuk assign role admin ke user
-- Cara pakai:
--   1. Ganti email di bawah dengan email admin yang ingin di-set
--   2. Jalankan di Supabase SQL Editor
--   3. https://supabase.com/dashboard/project/YOUR_PROJECT_REF/sql
--
-- Project REF bisa dilihat di: Supabase Dashboard > Settings > General

-- ══════════════════════════════════════════════════════════════════════════════
-- ASSIGN ADMIN ROLE
-- ══════════════════════════════════════════════════════════════════════════════
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"roles": ["admin"]}'::jsonb
WHERE email = 'GANTI_DENGAN_EMAIL_ADMIN@example.com';

-- ══════════════════════════════════════════════════════════════════════════════
-- VERIFIKASI
-- Jalankan query di bawah ini SETELAH UPDATE di atas untuk memastikan role
-- sudah ter-assign dengan benar.
-- ══════════════════════════════════════════════════════════════════════════════
SELECT
  id,
  email,
  raw_app_meta_data -> 'roles' AS roles
FROM auth.users
WHERE email = 'GANTI_DENGAN_EMAIL_ADMIN@example.com';

-- Jika hasil roles kolom adalah ["admin"], berarti berhasil.
-- Jika NULL atau [], berarti gagal — cek apakah email sudah benar.

-- ══════════════════════════════════════════════════════════════════════════════
-- REVOKE ADMIN ROLE (jalankan hanya jika perlu mencabut akses admin)
-- ══════════════════════════════════════════════════════════════════════════════
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data - 'roles'
-- WHERE email = 'GANTI_DENGAN_EMAIL_ADMIN@example.com';
