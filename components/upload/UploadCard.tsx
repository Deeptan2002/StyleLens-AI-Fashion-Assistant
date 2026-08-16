interface UploadCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function UploadCard({
  title,
  description,
  children,
}: UploadCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-slate-500">
        {description}
      </p>

      <div className="mt-8">
        {children}
      </div>
    </div>
  );
}