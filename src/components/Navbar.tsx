import { ShoppingBag } from 'lucide-react';
import { AppPage } from '../types/scoopshack';

interface NavbarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_ITEMS: Array<{ id: AppPage; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'lookup', label: 'Bill Lookup' },
  { id: 'staff', label: 'Staff Desk' },
];

export function Navbar({ activePage, onNavigate, cartCount, onOpenCart }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 border-b border-[#E8DFD1] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="font-display text-2xl font-bold tracking-tight text-[#3B2318] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9546B] rounded"
        >
          ScoopShack
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9546B] rounded ${
                  isActive
                    ? 'text-[#3B2318] font-semibold'
                    : 'text-[#7A6357] hover:text-[#3B2318]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#D9546B] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open order bag with ${cartCount} items`}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#3B2318] text-[#FAF6EE] text-sm font-medium hover:bg-[#523224] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9546B] focus-visible:ring-offset-2"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Bag</span>
            <span className="tabular-nums font-mono text-xs bg-[#D9546B] text-white px-2 py-0.5 rounded-full min-w-[1.5rem] text-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile secondary compact nav strip */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden flex items-center justify-around border-t border-[#E8DFD1] px-2 py-2 bg-[#FFFDF9]"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#3B2318] text-[#FAF6EE]'
                  : 'text-[#7A6357] hover:text-[#3B2318]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
