import { motion } from "framer-motion";
import { Sparkles, Trophy, TrendingUp } from "lucide-react";

interface SuccessCelebrationProps {
  outfitCount: number;
}

export default function SuccessCelebration({ outfitCount }: SuccessCelebrationProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="mb-8 overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 text-center shadow-lg"
    >
      {/* Animated Icons */}
      <div className="relative mb-4 flex justify-center">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl"
        >
          <Trophy className="h-8 w-8 text-white" />
        </motion.div>

        {/* Floating sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, (i - 1) * 15, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
            className="absolute top-0"
            style={{ left: `${30 + i * 20}%` }}
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </motion.div>
        ))}
      </div>

      {/* Success Message */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-2 text-3xl font-bold text-slate-900"
      >
        Your Style DNA is Ready! 🎉
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-slate-600"
      >
        {outfitCount > 1 
          ? `We analyzed ${outfitCount} outfits and found your perfect match!`
          : "Your virtual try-on is complete with AI-powered styling advice!"
        }
      </motion.p>

      {/* Animated Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex justify-center gap-6"
      >
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm font-semibold text-slate-900">AI Analyzed</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-semibold text-slate-900">Style Matched</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
