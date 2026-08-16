import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  href,
  children,
  variant = "primary",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300";

  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-lg hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-xl",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:border-indigo-500 hover:text-indigo-600",
  };

  return (
    <Link href={href} className={`${baseStyles} ${variants[variant]}`}>
      {children}
      {variant === "primary" && <ArrowRight size={20} />}
    </Link>
  );
}