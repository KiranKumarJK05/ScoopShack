import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem } from '../types/scoopshack';
import { formatINR } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (itemId: number, nextQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onBrowseMenu: () => void;
}

export function CartDrawer({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onBrowseMenu,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, entry) => sum + entry.menuItem.price * entry.quantity,
    0,
  );
  const totalUnits = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Your ScoopShack Order Bag"
      className="fixed inset-0 z-50 flex justify-end no-print"
    >
      <div
        className="fixed inset-0 bg-[#3B2318]/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="relative z-10 w-full max-w-md bg-[#FFFDF9] h-full flex flex-col border-l border-[#E8DFD1] shadow-xl">
        <div className="px-6 py-5 border-b border-[#E8DFD1] flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-[#3B2318]">
              Order Bag
            </h2>
            <p className="text-xs text-[#7A6357] mt-0.5 tabular-nums">
              {totalUnits} {totalUnits === 1 ? 'item' : 'items'} selected
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order bag"
            className="p-2 rounded-full text-[#7A6357] hover:text-[#3B2318] hover:bg-[#F4EDE0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-[#F4EDE0] flex items-center justify-center text-[#7A6357]">
                <ShoppingBag className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-[#3B2318]">
                Your bag is empty
              </h3>
              <p className="mt-2 text-sm text-[#7A6357] max-w-xs">
                Explore our freshly churned scoops, sundaes, mango shakes, and kulfi sticks to start an order.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBrowseMenu();
                }}
                className="mt-6 px-5 py-2.5 rounded-full bg-[#D9546B] text-white text-sm font-medium hover:bg-[#C24158] transition-colors cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#E8DFD1]">
              {cart.map(({ menuItem, quantity }) => {
                const atMaxStock = quantity >= menuItem.stock;
                const lineTotal = menuItem.price * quantity;
                return (
                  <li key={menuItem.id} className="py-4 first:pt-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-[#7A6357] font-mono tabular-nums">
                          #{menuItem.id} · {menuItem.category}
                        </p>
                        <h3 className="mt-0.5 font-display text-base font-semibold text-[#3B2318]">
                          {menuItem.name}
                        </h3>
                        <p className="mt-1 text-xs text-[#7A6357] font-mono tabular-nums">
                          {formatINR(menuItem.price)} each · {menuItem.stock} available
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(menuItem.id)}
                        aria-label={`Remove ${menuItem.name} from bag`}
                        className="p-1.5 rounded-lg text-[#7A6357] hover:text-[#B91C3B] hover:bg-[#FDF2F4] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-1 rounded-full bg-[#FAF6EE] border border-[#E8DFD1] p-1">
                        <button
                          type="button"
                          aria-label={`Decrease ${menuItem.name} quantity`}
                          onClick={() => onUpdateQuantity(menuItem.id, quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#3B2318] hover:bg-[#E8DFD1] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="font-mono tabular-nums text-sm font-semibold text-[#3B2318] min-w-[1.75rem] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${menuItem.name} quantity`}
                          disabled={atMaxStock}
                          onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                            atMaxStock
                              ? 'text-[#B5A89E] cursor-not-allowed'
                              : 'text-[#3B2318] hover:bg-[#E8DFD1] cursor-pointer'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="font-mono tabular-nums text-sm font-semibold text-[#3B2318]">
                        {formatINR(lineTotal)}
                      </span>
                    </div>

                    {atMaxStock && (
                      <p className="mt-2 text-xs text-[#B45309]">
                        Maximum available counter stock reached ({menuItem.stock}).
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#E8DFD1] bg-[#FAF6EE]">
            <div className="flex items-center justify-between text-sm text-[#7A6357]">
              <span>Items Subtotal</span>
              <span className="font-mono tabular-nums text-base font-semibold text-[#3B2318]">
                {formatINR(subtotal)}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#7A6357]">
              Customer discount (0% Regular / 5% Student) and 18% GST are applied at checkout.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onClearCart}
                className="px-4 py-3 rounded-full border border-[#E8DFD1] bg-[#FFFDF9] text-xs font-medium text-[#7A6357] hover:text-[#3B2318] hover:border-[#3B2318] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Clear Bag
              </button>
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="flex-1 px-6 py-3 rounded-full bg-[#D9546B] text-white text-sm font-semibold hover:bg-[#C24158] transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
