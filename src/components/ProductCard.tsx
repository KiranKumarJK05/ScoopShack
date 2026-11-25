import { useState } from 'react';
import { AlertTriangle, IceCreamCone, Minus, Plus } from 'lucide-react';
import { MenuItem } from '../types/scoopshack';
import { formatINR } from '../services/api';

interface ProductCardProps {
  item: MenuItem;
  cartQuantity: number;
  onAdd: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: number, nextQuantity: number) => void;
}

export function ProductCard({
  item,
  cartQuantity,
  onAdd,
  onUpdateQuantity,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = item.stock <= 0;
  const isLowStock = item.stock > 0 && item.stock < 10;
  const canIncrement = cartQuantity < item.stock;

  return (
    <article className="group flex flex-col bg-[#FFFDF9] border border-[#E8DFD1] rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-[#F4EDE0] overflow-hidden">
        {!imgError && item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F4EDE0] to-[#E8DFD1] text-[#7A6357] p-6 text-center">
            <IceCreamCone className="w-10 h-10 mb-2 text-[#D9546B]" aria-hidden="true" />
            <span className="font-display text-base font-semibold text-[#3B2318]">
              {item.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col p-5">
        {/* Clean unboxed metadata row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#7A6357]">
          <span className="font-mono tabular-nums">#{item.id}</span>
          <span aria-hidden="true">·</span>
          <span>{item.category}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{item.stock} left</span>
          <span aria-hidden="true">·</span>
          {isOutOfStock ? (
            <span className="font-semibold text-[#B91C3B]">Out of stock</span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 font-semibold text-[#B45309]">
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>LOW</span>
            </span>
          ) : (
            <span className="font-semibold text-[#5F8264]">OK</span>
          )}
        </div>

        <h3 className="mt-2 font-display text-xl font-semibold text-[#3B2318] leading-snug">
          {item.name}
        </h3>

        <p className="mt-2 text-sm text-[#7A6357] leading-relaxed flex-1">
          {item.description}
        </p>

        <div className="mt-5 pt-4 border-t border-[#E8DFD1] flex items-center justify-between gap-3">
          <span className="font-mono tabular-nums text-lg font-semibold text-[#3B2318]">
            {formatINR(item.price)}
          </span>

          {cartQuantity === 0 ? (
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => onAdd(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                isOutOfStock
                  ? 'bg-[#E8DFD1] text-[#7A6357] cursor-not-allowed'
                  : 'bg-[#D9546B] text-white hover:bg-[#C24158] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9546B] focus-visible:ring-offset-2'
              }`}
            >
              {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-full bg-[#FAF6EE] border border-[#E8DFD1] p-1">
              <button
                type="button"
                aria-label={`Decrease quantity of ${item.name}`}
                onClick={() => onUpdateQuantity(item.id, cartQuantity - 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#3B2318] hover:bg-[#E8DFD1] transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <span className="font-mono tabular-nums text-sm font-semibold text-[#3B2318] min-w-[1.75rem] text-center">
                {cartQuantity}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${item.name}`}
                disabled={!canIncrement}
                onClick={() => onUpdateQuantity(item.id, cartQuantity + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  canIncrement
                    ? 'text-[#3B2318] hover:bg-[#E8DFD1] cursor-pointer'
                    : 'text-[#B5A89E] cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
