import { useMemo, useState } from 'react';
import { RefreshCw, Search, X } from 'lucide-react';
import { MENU_CATEGORIES } from '../data/officialMenu';
import { CartItem, MenuItem } from '../types/scoopshack';
import { ProductCard } from './ProductCard';

interface MenuPageProps {
  menu: MenuItem[];
  loading: boolean;
  error: string | null;
  cart: CartItem[];
  onRefresh: () => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateCartQuantity: (itemId: number, nextQuantity: number) => void;
}

export function MenuPage({
  menu,
  loading,
  error,
  cart,
  onRefresh,
  onAddToCart,
  onUpdateCartQuantity,
}: MenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return menu.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        String(item.id).includes(q)
      );
    });
  }, [menu, selectedCategory, searchQuery]);

  const getCartQuantity = (id: number) =>
    cart.find((c) => c.menuItem.id === id)?.quantity ?? 0;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8DFD1]">
        <div>
          <p className="text-sm font-medium text-[#5F8264]">
            Official Parlour Selection · IDs 101–106
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#3B2318] tracking-tight">
            Creamery Menu
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#7A6357] max-w-2xl">
            Browse all six signature ScoopShack creations with live counter availability. Items below 10 units display LOW stock status.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8DFD1] bg-[#FFFDF9] text-xs font-medium text-[#3B2318] hover:border-[#3B2318] transition-colors self-start md:self-auto whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Category filters & search bar */}
      <div className="mt-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter menu by category"
          className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F4EDE0] border border-[#E8DFD1]"
        >
          {MENU_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#FFFDF9] text-[#3B2318] shadow-sm font-semibold'
                    : 'text-[#7A6357] hover:text-[#3B2318]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            className="w-4 h-4 text-[#7A6357] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flavour or ID (e.g. 102)..."
            aria-label="Search menu items"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#E8DFD1] text-sm text-[#3B2318] placeholder:text-[#A39387] focus:outline-none focus:ring-2 focus:ring-[#D9546B]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#7A6357] hover:text-[#3B2318] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 p-4 rounded-xl bg-[#FDF2F4] border border-[#F5C2CB] text-sm text-[#9F1239]"
        >
          {error}
        </div>
      )}

      {loading && menu.length === 0 ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-[380px] rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1] animate-pulse"
            />
          ))}
        </div>
      ) : filteredMenu.length === 0 ? (
        <div className="mt-10 p-12 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1] text-center">
          <h2 className="font-display text-xl font-semibold text-[#3B2318]">
            No creations match your filter
          </h2>
          <p className="mt-2 text-sm text-[#7A6357]">
            Try clearing your search query or switching back to All categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-5 px-5 py-2.5 rounded-full bg-[#3B2318] text-[#FAF6EE] text-xs font-medium hover:bg-[#523224] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredMenu.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              cartQuantity={getCartQuantity(item.id)}
              onAdd={onAddToCart}
              onUpdateQuantity={onUpdateCartQuantity}
            />
          ))}
        </div>
      )}
    </section>
  );
}
