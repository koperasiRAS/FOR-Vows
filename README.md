This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Setup Admin Account

Admin accounts must be created manually for security. No self-registration.

### Prerequisites
- An existing user account in Supabase Auth (created via `/auth/register` or any auth method)
- Access to your Supabase project dashboard

### Steps

1. **Create (or identify) the admin user**
   - If the user doesn't exist yet, have them sign up at `/auth/register`
   - Note their email address

2. **Assign admin role via SQL**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**
   - Copy the content from `supabase/scripts/assign-admin-role.sql`
   - Replace `GANTI_DENGAN_EMAIL_ADMIN@example.com` with the actual admin email
   - Run the query

3. **Verify**
   - The `SELECT` query at the bottom of the script should return `roles = ["admin"]`

4. **Login**
   - The admin can now sign in at `/admin/login` using their email and password

### Revoke Admin Access

Run the commented `REVOKE` query at the bottom of `supabase/scripts/assign-admin-role.sql` with the target email.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
