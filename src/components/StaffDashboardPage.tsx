import { AlertTriangle, CheckCircle2, RefreshCw, RotateCcw } from 'lucide-react';
import { formatINR, scoopShackApi } from '../services/api';
import { MenuItem, SalesReport } from '../types/scoopshack';

interface StaffDashboardPageProps {
  menu: MenuItem[];
  report: SalesReport | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onResetDemo: () => void;
  onInspectOrder: (orderId: string) => void;
}

export function StaffDashboardPage({
  menu,
  report,
  loading,
  error,
  onRefresh,
  onResetDemo,
  onInspectOrder,
}: StaffDashboardPageProps) {
  const lowStockItems = menu.filter((item) => item.stock < 10);
  const isRemote = scoopShackApi.isUsingRemoteBackend();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8DFD1]">
        <div>
          <p className="text-sm font-medium text-[#5F8264]">
            Parlour Operations · Inventory &amp; Sales
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#3B2318] tracking-tight">
            Staff Management Desk
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#7A6357]">
            Monitor stock thresholds, counter dispatch windows, daily revenue, and top-performing creations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isRemote && (
            <button
              type="button"
              onClick={onResetDemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8DFD1] bg-[#FFFDF9] text-xs font-medium text-[#7A6357] hover:text-[#3B2318] hover:border-[#3B2318] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Demo Data</span>
            </button>
          )}
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B2318] text-[#FAF6EE] text-xs font-medium hover:bg-[#523224] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Refresh Report</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-[#FDF2F4] border border-[#F5C2CB] text-sm text-[#9F1239]"
        >
          {error}
        </div>
      )}

      {/* 4-column KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1]">
          <p className="text-xs font-medium text-[#7A6357]">Total Orders</p>
          <p className="mt-2 font-mono tabular-nums text-3xl font-bold text-[#3B2318]">
            {report?.totalOrders ?? 0}
          </p>
          <p className="mt-1 text-xs text-[#7A6357]">
            Dispatched across Windows 1 &amp; 2
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1]">
          <p className="text-xs font-medium text-[#7A6357]">Total Revenue (incl. GST)</p>
          <p className="mt-2 font-mono tabular-nums text-3xl font-bold text-[#3B2318]">
            {formatINR(report?.totalRevenue ?? 0)}
          </p>
          <p className="mt-1 text-xs text-[#7A6357] font-mono tabular-nums">
            GST collected: {formatINR(report?.totalGst ?? 0)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1]">
          <p className="text-xs font-medium text-[#7A6357]">Units Sold</p>
          <p className="mt-2 font-mono tabular-nums text-3xl font-bold text-[#3B2318]">
            {report?.totalUnitsSold ?? 0}
          </p>
          <p className="mt-1 text-xs text-[#7A6357] font-mono tabular-nums">
            Discounts given: {formatINR(report?.totalDiscounts ?? 0)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1]">
          <p className="text-xs font-medium text-[#7A6357]">Most Popular Product</p>
          {report?.mostPopularItem ? (
            <>
              <p className="mt-2 font-display text-xl font-bold text-[#3B2318] truncate">
                {report.mostPopularItem.itemName}
              </p>
              <p className="mt-1 text-xs text-[#5F8264] font-mono tabular-nums">
                {report.mostPopularItem.unitsSold} units · {formatINR(report.mostPopularItem.revenue)}
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 font-display text-xl font-bold text-[#7A6357]">
                No sales yet
              </p>
              <p className="mt-1 text-xs text-[#7A6357]">
                Place an order to rank items
              </p>
            </>
          )}
        </div>
      </div>

      {/* Low Stock Alert Strip */}
      {lowStockItems.length > 0 ? (
        <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-semibold text-[#92400E]">
                Low Stock Alert ({lowStockItems.length}{' '}
                {lowStockItems.length === 1 ? 'item' : 'items'} below 10 units)
              </h2>
              <p className="mt-1 text-xs text-[#92400E]">
                {lowStockItems
                  .map((item) => `#${item.id} ${item.name} (${item.stock} remaining)`)
                  .join(' · ')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#EEF4EE] border border-[#CFE0D1] flex items-center gap-3 text-sm text-[#3F5E43]">
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>All 6 menu items are stocked at OK levels (10 or more units).</span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8DFD1] flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[#3B2318]">
            Menu &amp; Live Stock Ledger
          </h2>
          <span className="text-xs text-[#7A6357]">LOW &lt; 10 · OK &ge; 10</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#7A6357] bg-[#FAF6EE] border-b border-[#E8DFD1]">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Item</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium text-right">Price</th>
                <th className="px-6 py-3 font-medium text-right">Available Stock</th>
                <th className="px-6 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFD1]">
              {menu.map((item) => {
                const isOut = item.stock <= 0;
                const isLow = item.stock < 10;
                return (
                  <tr key={item.id} className="hover:bg-[#FAF6EE]/60 transition-colors">
                    <td className="px-6 py-3.5 font-mono tabular-nums text-[#7A6357]">
                      {item.id}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-[#3B2318]">
                      {item.name}
                    </td>
                    <td className="px-6 py-3.5 text-[#7A6357]">{item.category}</td>
                    <td className="px-6 py-3.5 text-right font-mono tabular-nums text-[#3B2318]">
                      {formatINR(item.price)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono tabular-nums font-semibold text-[#3B2318]">
                      {item.stock}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-xs font-semibold">
                      {isOut ? (
                        <span className="text-[#B91C3B]">OUT (LOW)</span>
                      ) : isLow ? (
                        <span className="text-[#B45309]">LOW</span>
                      ) : (
                        <span className="text-[#5F8264]">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8DFD1] flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[#3B2318]">
            Order History
          </h2>
          <span className="text-xs text-[#7A6357] font-mono tabular-nums">
            {report?.recentOrders.length ?? 0} recorded
          </span>
        </div>

        {!report || report.recentOrders.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#7A6357]">
            No orders have been placed yet in this session.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#7A6357] bg-[#FAF6EE] border-b border-[#E8DFD1]">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Token / Window</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium text-right">Subtotal</th>
                  <th className="px-6 py-3 font-medium text-right">GST (18%)</th>
                  <th className="px-6 py-3 font-medium text-right">Final Total</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD1]">
                {report.recentOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-[#FAF6EE]/60 transition-colors">
                    <td className="px-6 py-3.5 font-mono tabular-nums font-semibold text-[#3B2318]">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-3.5 font-mono tabular-nums text-[#7A6357]">
                      #{order.tokenNumber} · Window {order.serviceWindow}
                    </td>
                    <td className="px-6 py-3.5 text-[#3B2318]">{order.customerName}</td>
                    <td className="px-6 py-3.5 text-[#7A6357]">
                      {order.customerType === 'STUDENT' ? 'Student (5%)' : 'Regular (0%)'}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono tabular-nums text-[#7A6357]">
                      {formatINR(order.subtotal)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono tabular-nums text-[#7A6357]">
                      {formatINR(order.gstAmount)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono tabular-nums font-semibold text-[#3B2318]">
                      {formatINR(order.finalTotal)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onInspectOrder(order.orderId)}
                        className="text-xs font-semibold text-[#D9546B] hover:text-[#C24158] cursor-pointer whitespace-nowrap"
                      >
                        View Bill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
