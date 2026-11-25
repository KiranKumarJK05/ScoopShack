import { useCallback, useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { BillLookupPage } from './components/BillLookupPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { MenuPage } from './components/MenuPage';
import { Navbar } from './components/Navbar';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { StaffDashboardPage } from './components/StaffDashboardPage';
import { ApiError, scoopShackApi } from './services/api';
import {
  AppPage,
  CartItem,
  CustomerType,
  MenuItem,
  Order,
  SalesReport,
} from './types/scoopshack';

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>('home');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [lookupOrderId, setLookupOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const loadMenu = useCallback(async () => {
    setMenuLoading(true);
    setMenuError(null);
    try {
      const items = await scoopShackApi.getMenu();
      setMenu(items);
      // Sync cart item stock references with latest backend stock
      setCart((prev) =>
        prev
          .map((entry) => {
            const fresh = items.find((m) => m.id === entry.menuItem.id);
            if (!fresh || fresh.stock <= 0) return null;
            return {
              menuItem: fresh,
              quantity: Math.min(entry.quantity, fresh.stock),
            };
          })
          .filter((entry): entry is CartItem => Boolean(entry)),
      );
    } catch (err) {
      setMenuError(
        err instanceof ApiError
          ? err.message
          : 'Unable to load menu right now. Please try again.',
      );
    } finally {
      setMenuLoading(false);
    }
  }, []);

  const loadSalesReport = useCallback(async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      const report = await scoopShackApi.getSalesReport();
      setSalesReport(report);
    } catch (err) {
      setReportError(
        err instanceof ApiError
          ? err.message
          : 'Unable to load sales report right now.',
      );
    } finally {
      setReportLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMenu();
    void loadSalesReport();
  }, [loadMenu, loadSalesReport]);

  const handleNavigate = (page: AppPage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'staff') {
      void loadMenu();
      void loadSalesReport();
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    if (item.stock <= 0) {
      showToast(`${item.name} is currently out of stock.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((entry) => entry.menuItem.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          showToast(`Maximum stock (${item.stock}) reached for ${item.name}.`);
          return prev;
        }
        showToast(`Added another ${item.name} to bag.`);
        return prev.map((entry) =>
          entry.menuItem.id === item.id
            ? { menuItem: item, quantity: entry.quantity + 1 }
            : entry,
        );
      }
      showToast(`Added ${item.name} to bag.`);
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (itemId: number, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCart((prev) => prev.filter((entry) => entry.menuItem.id !== itemId));
      return;
    }
    setCart((prev) =>
      prev.map((entry) => {
        if (entry.menuItem.id !== itemId) return entry;
        const clamped = Math.min(nextQuantity, entry.menuItem.stock);
        return { ...entry, quantity: clamped };
      }),
    );
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((entry) => entry.menuItem.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenCheckout = () => {
    setCheckoutError(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSubmitOrder = async (
    customerName: string,
    customerType: CustomerType,
  ) => {
    setSubmittingOrder(true);
    setCheckoutError(null);
    try {
      const order = await scoopShackApi.createOrder({
        customerName,
        customerType,
        items: cart.map((entry) => ({
          itemId: entry.menuItem.id,
          quantity: entry.quantity,
        })),
      });

      setCart([]);
      setIsCheckoutOpen(false);
      setConfirmedOrder(order);
      await Promise.all([loadMenu(), loadSalesReport()]);
    } catch (err) {
      if (err instanceof ApiError) {
        setCheckoutError(err.message);
      } else {
        setCheckoutError('Order submission failed. Please review your bag and try again.');
      }
      await loadMenu();
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleResetDemo = async () => {
    await scoopShackApi.resetMockDemoData();
    setCart([]);
    setConfirmedOrder(null);
    setLookupOrderId(null);
    await Promise.all([loadMenu(), loadSalesReport()]);
    showToast('Demo inventory and orders restored to initial state.');
  };

  const totalCartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const recentOrderIds = salesReport?.recentOrders.map((o) => o.orderId) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#3B2318]">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            menu={menu}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'menu' && (
          <MenuPage
            menu={menu}
            loading={menuLoading}
            error={menuError}
            cart={cart}
            onRefresh={() => void loadMenu()}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
          />
        )}

        {activePage === 'lookup' && (
          <BillLookupPage
            initialOrderId={lookupOrderId}
            recentOrderIds={recentOrderIds}
          />
        )}

        {activePage === 'staff' && (
          <StaffDashboardPage
            menu={menu}
            report={salesReport}
            loading={reportLoading}
            error={reportError}
            onRefresh={() => {
              void loadMenu();
              void loadSalesReport();
            }}
            onResetDemo={() => void handleResetDemo()}
            onInspectOrder={(orderId) => {
              setLookupOrderId(orderId);
              handleNavigate('lookup');
            }}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleOpenCheckout}
        onBrowseMenu={() => handleNavigate('menu')}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        cart={cart}
        submitting={submittingOrder}
        error={checkoutError}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handleSubmitOrder}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewInLookup={(orderId) => {
          setConfirmedOrder(null);
          setLookupOrderId(orderId);
          handleNavigate('lookup');
        }}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3B2318] text-[#FAF6EE] text-xs font-medium shadow-lg no-print"
        >
          <Check className="w-3.5 h-3.5 text-[#7A9E7E]" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}