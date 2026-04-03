import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const isHovered = hoveredCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory?.(category.id)}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              isSelected
                ? 'bg-[#F5A623] text-black border-2 border-[#F5A623]'
                : 'bg-[rgba(29,29,29,0.5)] text-white border-2 border-transparent hover:border-[#F5A623]'
            }`}
            style={{
              boxShadow: isHovered && !isSelected ? '0 0 15px rgba(245, 166, 35, 0.3)' : 'none',
            }}
          >
            {category.name}
          </button>
        );
      })}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
