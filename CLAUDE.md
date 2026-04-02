@AGENTS.md

## Mobile Responsiveness Rules

- Admin panel must be fully responsive: mobile (<768px), tablet (768-1023px), desktop (≥1024px)
- No fixed widths that exceed viewport — always use w-full/max-w-\*
- Use Tailwind responsive prefixes: sm: md: lg:
- Bottom nav component (BottomNav.tsx) handles mobile navigation — sidebar is desktop/tablet only
- All grids use responsive columns: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
