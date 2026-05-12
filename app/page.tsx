import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-zinc-400 dark:bg-zinc-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-zinc-300 dark:bg-zinc-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-zinc-200 dark:bg-zinc-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl px-4">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Welcome
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            User time sheet management application.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Link
            href="/login"
            className="group relative flex h-14 w-full sm:w-48 items-center justify-center rounded-2xl bg-zinc-900 dark:bg-zinc-50 px-8 text-lg font-bold text-zinc-50 dark:text-zinc-900 transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-zinc-500/20"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="flex h-14 w-full sm:w-48 items-center justify-center rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl px-8 text-lg font-bold transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 shadow-lg"
          >
            Create Account
          </Link>
        </div>

        {/* Features Row */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700">
          <div className="p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm">
            <h3 className="font-bold">Secure Auth</h3>
            <p className="text-sm text-zinc-500">Bcrypt hashing & MongoDB persistence.</p>
          </div>
          <div className="p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm">
            <h3 className="font-bold">Dynamic UI</h3>
            <p className="text-sm text-zinc-500">Smooth animations & Glassmorphism.</p>
          </div>
          <div className="p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm">
            <h3 className="font-bold">Profile Edit</h3>
            <p className="text-sm text-zinc-500">Full dashboard with profile management.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-zinc-400 text-sm">
        Machine Test Task
      </footer>
    </div>
  );
}
