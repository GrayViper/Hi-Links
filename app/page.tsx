import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AuthButtons } from "@/components/auth-buttons";
import {
  Link as LinkIcon,
  Zap,
  BarChart3,
  ShieldCheck,
  Globe,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
            <LinkIcon size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">VibeLink</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="https://nextjs.org/docs" target="_blank" className="hover:text-white transition-colors">Next.js</Link>
          <Link href="https://clerk.com/docs" target="_blank" className="hover:text-white transition-colors">Clerk</Link>
          <Link href="https://orm.drizzle.team/docs/overview" target="_blank" className="hover:text-white transition-colors">Drizzle</Link>
          <Link href="https://neon.tech/docs" target="_blank" className="hover:text-white transition-colors">Neon</Link>
        </div>
        <div className="flex items-center gap-4">
          <AuthButtons />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-32 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 mx-auto max-w-5xl space-y-10">
          
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-5 py-2 text-sm text-zinc-400 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
            Powered by Next.js 16 App Router
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>

          <h1 className="text-6xl font-extrabold tracking-tighter sm:text-8xl">
            Shorten Your Links. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Expand Your Reach.
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-zinc-400 leading-relaxed">
            A premium, lightning-fast URL shortener built for modern teams. Secure authentication, robust analytics, and a beautiful interface all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <AuthButtons variant="cta" />
            <Link 
              href="https://github.com/drizzle-team/drizzle-orm" 
              target="_blank"
              className="group flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-4 text-lg font-semibold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white"
            >
              <DatabaseIcon size={20} />
              Drizzle ORM
            </Link>
          </div>
        </div>
      </main>

      {/* Interactive Features Grid */}
      <section id="features" className="relative z-10 border-t border-zinc-800/50 bg-zinc-950/50 px-4 py-32 backdrop-blur-3xl">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Everything you need</h2>
            <p className="text-xl text-zinc-400">Professional grade features wrapped in an elegant interface.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Zap className="text-yellow-400" size={32} />,
                title: "Lightning Fast",
                desc: "Edge-optimized redirects built on Next.js Server Components ensure your links load instantly anywhere in the world.",
                link: "https://nextjs.org/docs/app/building-your-application/routing"
              },
              {
                icon: <ShieldCheck className="text-emerald-400" size={32} />,
                title: "Secure by Default",
                desc: "Enterprise-grade authentication with Clerk keeps your links and analytics perfectly safe and private.",
                link: "https://clerk.com"
              },
              {
                icon: <BarChart3 className="text-indigo-400" size={32} />,
                title: "Powerful Tech",
                desc: "Backed by PostgreSQL and Drizzle ORM for reliable, type-safe database operations that scale with you.",
                link: "https://orm.drizzle.team"
              }
            ].map((feature, i) => (
              <a 
                key={i} 
                href={feature.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-start gap-4 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-8 transition-all hover:-translate-y-2 hover:border-zinc-700 hover:bg-zinc-800/50 hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className="rounded-2xl bg-zinc-800/80 p-4 transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950 py-12 text-center text-zinc-500">
        <div className="flex justify-center gap-6 mb-6">
          <Link href="https://github.com/drizzle-team/drizzle-orm" target="_blank" className="hover:text-white transition-colors" title="Drizzle ORM on GitHub"><GithubIcon size={24} /></Link>
          <Link href="https://neon.tech" target="_blank" className="hover:text-white transition-colors" title="Neon Serverless Postgres"><Globe size={24} /></Link>
          <Link href="https://clerk.com" target="_blank" className="hover:text-white transition-colors" title="Clerk Authentication"><TwitterIcon size={24} /></Link>
        </div>
        <p>© {new Date().getFullYear()} VibeLink. Built with Next.js & Drizzle.</p>
      </footer>
    </div>
  );
}

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )
}

function GithubIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
  );
}

function TwitterIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
  );
}
