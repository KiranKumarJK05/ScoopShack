import { AppPage } from '../types/scoopshack';

interface FooterProps {
  onNavigate: (page: AppPage) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-[#E8DFD1] bg-[#FFFDF9] mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="font-display text-2xl font-bold text-[#3B2318]">ScoopShack</p>
            <p className="mt-3 text-sm text-[#7A6357] leading-relaxed max-w-xs">
              Small-batch creamery crafting slow-churned scoops, sundaes, mango shakes, and heritage malai kulfi fresh every morning.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#3B2318] tracking-wide">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#7A6357]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#3B2318] transition-colors cursor-pointer"
                >
                  Creamery Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#3B2318] transition-colors cursor-pointer"
                >
                  Official Menu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('lookup')}
                  className="hover:text-[#3B2318] transition-colors cursor-pointer"
                >
                  Previous Bill Lookup
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('staff')}
                  className="hover:text-[#3B2318] transition-colors cursor-pointer"
                >
                  Staff Inventory Desk
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#3B2318] tracking-wide">Parlour Counter</h3>
            <div className="mt-3 space-y-1.5 text-sm text-[#7A6357]">
              <p>42 Church Street Creamery Lane, Bengaluru 560001</p>
              <p>Daily 11:00 AM – 11:30 PM · Windows 1 &amp; 2</p>
              <p className="tabular-nums">hello@scoopshack.in · +91 80 4129 8820</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E8DFD1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6357]">
          <p>© {new Date().getFullYear()} ScoopShack Creamery. All rights reserved.</p>
          <p>Student 5% Discount · 18% GST Transparent Billing</p>
        </div>
      </div>
    </footer>
  );
}
