import Button from "@/components/ui/Button";
import HeroMockup from "./HeroMockup";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-indigo-50 py-8">
      <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 py-6 text-center">

        <span className="animate-fade-in rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
          ✨ Powered by YouCam AI
        </span>

        <h1 className="animate-fade-in-up mt-8 max-w-5xl text-6xl font-black leading-tight tracking-tight text-slate-900 md:text-7xl" style={{ animationDelay: "0.1s" }}>
          Your AI Fashion Assistant
          <br />
          That Knows What
          <span className="text-indigo-600"> Looks Best.</span>
        </h1>

        <p className="animate-fade-in-up mt-8 max-w-3xl text-xl leading-8 text-slate-700 font-medium" style={{ animationDelay: "0.2s" }}>
          Upload your selfie and wardrobe. Let AI analyze your style,
          recommend outfits for every occasion, and virtually try them on
          before you wear them.
        </p>

        {/* Buttons */}
        <div className="animate-fade-in-up mt-12 flex flex-wrap justify-center gap-5" style={{ animationDelay: "0.3s" }}>
          <Button href="/upload">
            Create My Style Profile
          </Button>
        </div>

        {/* Hero Mockup */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <HeroMockup />
        </div>

      </div>
    </section>
  );
}