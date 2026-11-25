import { useState, type FormEvent } from 'react';
import { AlertCircle, GraduationCap, User, X } from 'lucide-react';
import { CartItem, CustomerType } from '../types/scoopshack';
import { formatINR } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmitOrder: (customerName: string, customerType: CustomerType) => Promise<void>;
}

export function CheckoutModal({
  isOpen,
  cart,
  submitting,
  error,
  onClose,
  onSubmitOrder,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('REGULAR');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0,
  );
  const discountRate = customerType === 'STUDENT' ? 0.05 : 0;
  const estDiscount = Math.round(subtotal * discountRate * 100) / 100;
  const estTaxable = Math.round((subtotal - estDiscount) * 100) / 100;
  const estGst = Math.round(estTaxable * 0.18 * 100) / 100;
  const estTotal = Math.round((estTaxable + estGst) * 100) / 100;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = customerName.trim();
    if (trimmed.length < 2) {
      setValidationError('Please enter your name (at least 2 characters) for token dispatch.');
      return;
    }
    if (cart.length === 0) {
      setValidationError('Your order bag is empty.');
      return;
    }
    setValidationError(null);
    await onSubmitOrder(trimmed, customerType);
  };

  const displayError = validationError || error;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Checkout and Billing Summary"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print"
    >
      <div
        className="fixed inset-0 bg-[#3B2318]/45"
        onClick={submitting ? undefined : onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-xl bg-[#FFFDF9] border border-[#E8DFD1] rounded-2xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="px-6 py-5 border-b border-[#E8DFD1] flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#3B2318]">
              Confirm Your Order
            </h2>
            <p className="text-xs text-[#7A6357] mt-0.5">
              Enter customer details to generate your Order ID and counter token.
            </p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 rounded-full text-[#7A6357] hover:text-[#3B2318] hover:bg-[#F4EDE0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {displayError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-[#FDF2F4] border border-[#F5C2CB] flex items-start gap-2.5 text-sm text-[#9F1239]"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{displayError}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="checkout-customer-name"
              className="block text-sm font-semibold text-[#3B2318]"
            >
              Customer Name
            </label>
            <input
              id="checkout-customer-name"
              type="text"
              required
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g. Aarav Sharma"
              className="mt-2 w-full px-4 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#E8DFD1] text-sm text-[#3B2318] placeholder:text-[#A39387] focus:outline-none focus:ring-2 focus:ring-[#D9546B]"
            />
          </div>

          <div>
            <span className="block text-sm font-semibold text-[#3B2318]">
              Customer Type
            </span>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCustomerType('REGULAR')}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  customerType === 'REGULAR'
                    ? 'border-[#3B2318] bg-[#FAF6EE]'
                    : 'border-[#E8DFD1] bg-[#FFFDF9] hover:border-[#7A6357]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B2318]">
                    <User className="w-4 h-4" aria-hidden="true" />
                    <span>Regular</span>
                  </span>
                  <span className="font-mono text-xs text-[#7A6357]">0% off</span>
                </div>
                <p className="mt-1 text-xs text-[#7A6357]">Standard parlour billing</p>
              </button>

              <button
                type="button"
                onClick={() => setCustomerType('STUDENT')}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  customerType === 'STUDENT'
                    ? 'border-[#5F8264] bg-[#EEF4EE]'
                    : 'border-[#E8DFD1] bg-[#FFFDF9] hover:border-[#7A6357]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B2318]">
                    <GraduationCap className="w-4 h-4 text-[#5F8264]" aria-hidden="true" />
                    <span>Student</span>
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#5F8264]">
                    5% off
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#7A6357]">Campus discount pre-GST</p>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-4 rounded-xl bg-[#FAF6EE] border border-[#E8DFD1]">
            <h3 className="text-xs font-semibold text-[#7A6357] tracking-wide">
              Order Summary
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {cart.map(({ menuItem, quantity }) => (
                <li
                  key={menuItem.id}
                  className="flex items-center justify-between gap-4 text-[#3B2318]"
                >
                  <span>
                    <span className="font-mono tabular-nums">{quantity}×</span>{' '}
                    {menuItem.name}
                  </span>
                  <span className="font-mono tabular-nums">
                    {formatINR(menuItem.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-3 border-t border-[#E8DFD1] space-y-1.5 text-xs text-[#7A6357]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#3B2318]">
                  {formatINR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  Discount ({customerType === 'STUDENT' ? '5% Student' : '0% Regular'})
                </span>
                <span className="font-mono tabular-nums text-[#5F8264]">
                  −{formatINR(estDiscount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxable Amount</span>
                <span className="font-mono tabular-nums text-[#3B2318]">
                  {formatINR(estTaxable)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-mono tabular-nums text-[#3B2318]">
                  {formatINR(estGst)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E8DFD1] flex justify-between text-sm font-semibold text-[#3B2318]">
                <span>Estimated Final Total</span>
                <span className="font-mono tabular-nums text-base">
                  {formatINR(estTotal)}
                </span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#7A6357]">
              Authoritative bill totals, stock check, Order ID, and Window assignment are verified by the backend upon submission.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#E8DFD1] text-sm font-medium text-[#7A6357] hover:text-[#3B2318] transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="px-6 py-2.5 rounded-full bg-[#D9546B] text-white text-sm font-semibold hover:bg-[#C24158] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
