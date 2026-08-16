import { Sparkles, Shirt, Palette, Star } from "lucide-react";

export default function HeroMockup() {
  return (
    <div className="relative mt-20 w-full max-w-5xl">

      <div className="rounded-[32px] border border-slate-200 bg-white shadow-2xl">

        <div className="border-b border-slate-100 px-8 py-5">
          <p className="font-semibold text-slate-700">
            StyleSense AI Dashboard
          </p>
        </div>

        <div className="grid gap-8 p-10 md:grid-cols-2">

          <div className="flex items-center justify-center rounded-3xl bg-slate-100 p-12">

            <div className="flex h-52 w-52 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-7xl text-white shadow-xl">
              👤
            </div>

          </div>

          <div className="space-y-5">

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5">
              <Palette className="text-indigo-600" size={24} />
              <div>
                <p className="font-semibold text-slate-900">Skin Tone</p>
                <p className="text-slate-600 font-medium">Warm Neutral</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5">
              <Shirt className="text-indigo-600" size={24} />
              <div>
                <p className="font-semibold text-slate-900">Best Style</p>
                <p className="text-slate-600 font-medium">Business Casual</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5">
              <Star className="text-yellow-500" size={24} />
              <div>
                <p className="font-semibold text-slate-900">Style Score</p>
                <p className="text-slate-600 font-medium">96 / 100</p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Cards */}

      <div className="absolute -left-8 top-20 rounded-2xl bg-white p-4 shadow-xl border border-slate-100">
        <div className="flex items-center gap-3">
          <Sparkles className="text-indigo-600" size={20} />
          <div>
            <p className="font-semibold text-slate-900">Interview Ready</p>
            <p className="text-sm text-slate-600 font-medium">98% Match</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-6 bottom-12 rounded-2xl bg-white p-4 shadow-xl border border-slate-100">
        <div className="flex items-center gap-3">
          <Palette className="text-purple-600" size={20} />
          <div>
            <p className="font-semibold text-slate-900">Best Colors</p>
            <p className="text-sm text-slate-600 font-medium">
              Navy • Olive • White
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}