import { Users, TrendingUp, Award, Sparkles } from "lucide-react";

export default function StatsBar() {
  const stats = [
    {
      icon: Users,
      value: "10K+",
      label: "Style Profiles",
      color: "text-indigo-600",
    },
    {
      icon: TrendingUp,
      value: "40%",
      label: "Fewer Returns",
      color: "text-green-600",
    },
    {
      icon: Award,
      value: "98%",
      label: "Match Accuracy",
      color: "text-yellow-600",
    },
    {
      icon: Sparkles,
      value: "50K+",
      label: "AI Try-Ons",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="border-y border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
