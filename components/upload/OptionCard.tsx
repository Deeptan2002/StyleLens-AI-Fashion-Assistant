import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface OptionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  badge?: string;
  onClick: () => void;
}

export default function OptionCard({
  title,
  description,
  icon,
  badge,
  onClick,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            {icon}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900">
                {title}
              </h3>

              {badge && (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {badge}
                </span>
              )}
            </div>

            <p className="mt-2 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <ChevronRight
          className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
          size={24}
        />
      </div>
    </button>
  );
}