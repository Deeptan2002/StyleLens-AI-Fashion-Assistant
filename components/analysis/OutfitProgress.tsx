import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

interface OutfitProgressProps {
  totalOutfits: number;
  currentOutfit: number;
  status: "processing" | "complete";
}

export default function OutfitProgress({ totalOutfits, currentOutfit, status }: OutfitProgressProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Processing Your Outfits</h3>
        <span className="text-sm text-slate-600">
          {currentOutfit} of {totalOutfits}
        </span>
      </div>

      <div className="space-y-3">
        {Array.from({ length: totalOutfits }, (_, i) => {
          const outfitNum = i + 1;
          const isComplete = outfitNum < currentOutfit;
          const isActive = outfitNum === currentOutfit && status === "processing";
          const isPending = outfitNum > currentOutfit;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                isComplete
                  ? "border-green-200 bg-green-50"
                  : isActive
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex-shrink-0">
                {isComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isComplete ? "text-green-900" : isActive ? "text-indigo-900" : "text-slate-600"
                }`}>
                  Outfit #{outfitNum}
                </p>
              </div>

              {isComplete && (
                <span className="text-xs font-medium text-green-600">Complete</span>
              )}
              {isActive && (
                <span className="text-xs font-medium text-indigo-600">Processing...</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full bg-indigo-600"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentOutfit / totalOutfits) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
