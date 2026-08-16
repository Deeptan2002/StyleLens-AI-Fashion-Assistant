import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface WardrobeOptionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}

export default function WardrobeOptionCard({
  title,
  description,
  icon,
  onClick,
}: WardrobeOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            {icon}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-2 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <ChevronRight
          size={24}
          className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
        />
      </div>
    </button>
  );
}