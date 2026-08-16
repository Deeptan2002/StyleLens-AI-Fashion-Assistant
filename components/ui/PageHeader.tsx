interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
        {title}
      </h1>

      <p className="mt-5 text-lg leading-8 text-slate-600">
        {description}
      </p>
    </div>
  );
}