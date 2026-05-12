n<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Repository Overview

This project is a Next.js application using the App Router and TypeScript. It includes UI components, Tailwind CSS, Clerk authentication, Drizzle ORM for database management, and dark mode functionality.

## Key directories and files

- `app/`
  - `api/users/` — API routes for user management
  - `dashboard/` — protected dashboard page
  - `layout.tsx` — root layout for the app with theme provider
  - `page.tsx` — main page entry
  - `globals.css` — global styling

- `components/`
  - `theme-provider.tsx` — React context provider for dark mode theme management
  - `theme-toggle.tsx` — UI component for switching between light/dark/system themes
  - `ui/` — reusable UI components, including shared button and other view primitives

- `lib/`
  - `db.ts` — database connection and configuration for Drizzle ORM
  - `schema.ts` — database schema definitions for Drizzle ORM
  - `utils.ts` — application helper utilities

- `public/`
  - Static assets and public files served by Next.js

- `.agents/`
  - Contains custom agent rules and skill definitions used by the workspace agent system

- `drizzle.config.ts` — Drizzle ORM configuration
- `next.config.ts` — Next.js configuration
- `tsconfig.json` — TypeScript compiler options
- `package.json` — dependencies and scripts
- `postcss.config.mjs` — PostCSS/Tailwind config
- `eslint.config.mjs` — linting rules
- `proxy.ts` — local proxy helper, if used for API or dev server routing

## Agent-focused guidance

- Preserve the App Router conventions in `app/`.
- Prefer composable `components/ui` elements for reusable UI.
- All authentication in this app is handled by Clerk only. Do not introduce other auth methods.
- The `/dashboard` page must be a protected route and require the user to be logged in.
- If a logged-in user tries to access the homepage, they should be redirected to `/dashboard`.- Database operations should use Drizzle ORM with the schema defined in `lib/schema.ts`.
- Theme management is handled by the `ThemeProvider` component - use the `useTheme` hook for theme switching.- Keep changes isolated and consistent with the repo’s existing TypeScript style.
- Do not modify `node_modules/` or generated build artifacts in `.next/`.

## Working with this repo

1. Use `npm run dev` to start the Next.js development server.
2. Use `npm run build` to verify production build compatibility.
3. Use `npm run lint` to check TypeScript and linting rules.

## Notes

- This repo uses Next.js 16, React 19, and Tailwind v4 via PostCSS.
- Database integration is handled by Drizzle ORM with PostgreSQL.
- Authentication is managed by Clerk with protected routes.
- Dark mode functionality is implemented with theme persistence and system preference detection.
- `CLAUDE.md` is a secondary reference file that points back to `AGENTS.md`.

