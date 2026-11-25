import { ArrowRight } from 'lucide-react';
import { AppPage, CartItem, MenuItem } from '../types/scoopshack';
import { IceCreamHero3D } from './IceCreamHero3D';
import { ProductCard } from './ProductCard';

interface HomePageProps {
  menu: MenuItem[];
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateCartQuantity: (itemId: number, nextQuantity: number) => void;
  onNavigate: (page: AppPage) => void;
}

export function HomePage({
  menu,
  cart,
  onAddToCart,
  onUpdateCartQuantity,
  onNavigate,
}: HomePageProps) {
  // Feature 3 iconic items across distinct categories
  const featuredIds = [101, 102, 105];
  const featuredItems = featuredIds
    .map((id) => menu.find((item) => item.id === id))
    .filter((item): item is MenuItem => Boolean(item));

  const getCartQuantity = (id: number) =>
    cart.find((c) => c.menuItem.id === id)?.quantity ?? 0;

  return (
    <div>
      {/* Section 1: Editorial Split Hero with 3D Ice Cream Sculpture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-[#5F8264] tracking-wide">
              Small-batch creamery · Bengaluru
            </p>
            <h1
              className="mt-4 font-display font-bold text-[#3B2318] tracking-tight leading-[1.08]"
              style={{
                fontSize: 'clamp(2.4rem, 4.4vw, 3.85rem)',
                textWrap: 'balance',
              }}
            >
              Slow-churned scoops, crafted fresh every morning.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#7A6357] leading-relaxed max-w-xl">
              From speckled Madagascar vanilla bean and warm brownie sundaes to hand-simmered saffron kulfi. Order online for instant token dispatch at Windows 1 &amp; 2.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('menu')}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D9546B] text-white text-sm font-semibold hover:bg-[#C24158] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9546B] focus-visible:ring-offset-2"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('lookup')}
                className="px-6 py-3.5 rounded-full border border-[#E8DFD1] bg-[#FFFDF9] text-[#3B2318] text-sm font-medium hover:border-[#3B2318] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Look Up Previous Bill
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-[#E8DFD1] grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="font-mono tabular-nums text-xl font-semibold text-[#3B2318]">
                  6
                </p>
                <p className="mt-1 text-xs text-[#7A6357]">Signature Creations</p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-xl font-semibold text-[#5F8264]">
                  5% Off
                </p>
                <p className="mt-1 text-xs text-[#7A6357]">Student Privilege</p>
              </div>
              <div>
                <p className="font-mono tabular-nums text-xl font-semibold text-[#3B2318]">
                  2 Windows
                </p>
                <p className="mt-1 text-xs text-[#7A6357]">Odd &amp; Even Dispatch</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <IceCreamHero3D />
          </div>
        </div>
      </section>

      {/* Section 2: Featured Flavours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#E8DFD1]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
          <div>
            <p className="text-sm font-medium text-[#5F8264]">Parlour favourites</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-[#3B2318] tracking-tight">
              Featured from the Counter
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D9546B] hover:text-[#C24158] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View all 6 items</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              cartQuantity={getCartQuantity(item.id)}
              onAdd={onAddToCart}
              onUpdateQuantity={onUpdateCartQuantity}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Brand Story & Service Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#E8DFD1]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#5F8264]">Our Creamery Philosophy</p>
            <h2
              className="mt-2 font-display text-3xl font-bold text-[#3B2318] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Honest ingredients, zero queues, transparent receipts.
            </h2>
            <p className="mt-4 text-base text-[#7A6357] leading-relaxed">
              Every ScoopShack batch is spun at dawn in small stainless churns using farm cream, single-origin Belgian couverture, and seasonal Alphonso mangoes. Our dual-window token desk keeps pickup effortless even during late-night rushes.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1]">
              <p className="font-mono text-xs font-semibold text-[#D9546B]">01</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-[#3B2318]">
                Live Batch Stock
              </h3>
              <p className="mt-2 text-sm text-[#7A6357] leading-relaxed">
                Every scoop and tub is tracked in real time so your order is only confirmed when fresh stock is ready.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1]">
              <p className="font-mono text-xs font-semibold text-[#5F8264]">02</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-[#3B2318]">
                Student Fair Pricing
              </h3>
              <p className="mt-2 text-sm text-[#7A6357] leading-relaxed">
                Students receive an automatic 5% pre-tax discount before 18% GST is cleanly itemized on the final receipt.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1]">
              <p className="font-mono text-xs font-semibold text-[#3B2318]">03</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-[#3B2318]">
                Dual-Window Pickup
              </h3>
              <p className="mt-2 text-sm text-[#7A6357] leading-relaxed">
                Sequential ICE order IDs pair with odd tokens at Window 1 and even tokens at Window 2 for quick handoff.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
