# Hi-Links

Hi-Links is a modern URL shortener built with Next.js, Clerk authentication, Neon Postgres, and Drizzle ORM. It lets users create short links, track click analytics, toggle link activity, and manage their links from a polished dashboard.

See the Demo here: hilinks.vercel.app
## Features

- Create and manage shortened links
- Secure sign-in with Clerk
- Click analytics and tracking
- Active/inactive link toggling
- Clean dashboard UI built with Next.js App Router
- Database access via Neon Postgres + Drizzle

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

## Environment variables

Create a `.env.local` file in the project root and add the required values for your Neon and Clerk setup.

Example:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
DATABASE_URL=your_neon_database_url
```

## Deployment on Vercel

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Add the same environment variables in the Vercel project settings.
4. Deploy the app.

Vercel will automatically build and host the Next.js application for you.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:push
```

## Tech stack

- Next.js
- React
- TypeScript
- Clerk
- Neon Postgres
- Drizzle ORM
- Tailwind CSS
