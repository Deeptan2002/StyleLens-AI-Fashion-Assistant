import { ReactNode } from "react";
import { CheckCircle } from "lucide-react";

interface OccasionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
}

export default function OccasionCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: OccasionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full rounded-3xl border p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
      ${
        selected
          ? "border-indigo-600 bg-indigo-50"
          : "border-slate-200 bg-white hover:border-indigo-400"
      }`}
    >
      {selected && (
        <CheckCircle
          className="absolute right-5 top-5 text-indigo-600"
          size={24}
        />
      )}

      <div className="flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-2 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}