interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function Chip({
  label,
  selected,
  onClick,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-200 ${
        selected
          ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
          : "border-slate-300 bg-white text-slate-700 hover:border-indigo-500 hover:text-indigo-600"
      }`}
    >
      {label}
    </button>
  );
}