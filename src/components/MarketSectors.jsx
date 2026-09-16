import React from 'react';
import {
  Smartphone, Shirt, Home, Sparkle, Dumbbell, BookOpen, Layers,
  Wheat, ShoppingBasket, Building2, Truck, Globe2, ChevronRight,
} from 'lucide-react';

const ICONS = {
  all: Layers,
  local_food: Wheat,
  groceries: ShoppingBasket,
  real_estate: Building2,
  heavy_machinery: Truck,
  electronics: Smartphone,
  international: Globe2,
  fashion: Shirt,
  home: Home,
  beauty: Sparkle,
  sports: Dumbbell,
  books: BookOpen,
};

export function MarketSectors({ categories = [], selectedCategory, onSelectCategory }) {
  return (
    <div className="card p-4">
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">Sectors</h3>
      <div className="space-y-0.5">
        {categories.map((cat) => {
          const Icon = ICONS[cat.id] || Layers;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-sm transition-colors cursor-pointer group ${
                isActive ? 'bg-moss-50 text-moss-700 font-medium' : 'text-ink-soft hover:bg-paper-mist hover:text-ink'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={16} className={isActive ? 'text-moss-700' : 'text-ink-faint'} />
                {cat.name}
              </span>
              <ChevronRight size={14} className="text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
