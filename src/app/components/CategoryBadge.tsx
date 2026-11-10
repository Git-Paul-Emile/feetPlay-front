interface CategoryBadgeProps {
  label: string;
  active?: boolean;
}

export function CategoryBadge({ label, active }: CategoryBadgeProps) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
        active
          ? 'bg-[#F5A623] text-black'
          : 'bg-[rgba(29,29,29,0.8)] text-white hover:border-[#F5A623] border border-transparent'
      }`}
    >
      {label}
    </button>
  );
}
