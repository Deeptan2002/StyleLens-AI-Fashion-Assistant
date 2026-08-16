import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-lg">
            S
          </div>

          <div>
            <p className="text-xl font-bold text-slate-900">
              StyleLens
            </p>

            <p className="-mt-1 text-xs font-medium text-slate-600">
              AI Fashion Assistant
            </p>
          </div>
        </Link>

        {/* Tagline (replaces navigation) */}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-slate-600">
            ✨ <span className="text-indigo-600">YouCam API</span> Hackathon Project
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/upload"
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}