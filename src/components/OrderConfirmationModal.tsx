import { CheckCircle2, X } from 'lucide-react';
import { Order } from '../types/scoopshack';
import { ReceiptCard } from './ReceiptCard';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onViewInLookup: (orderId: string) => void;
}

export function OrderConfirmationModal({
  order,
  onClose,
  onViewInLookup,
}: OrderConfirmationModalProps) {
  if (!order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Order ${order.orderId} Confirmed`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-[#3B2318]/45 no-print"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl bg-[#FAF6EE] border border-[#E8DFD1] rounded-2xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="px-6 py-5 bg-[#FFFDF9] border-b border-[#E8DFD1] flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#5F8264]" aria-hidden="true" />
            <div>
              <h2 className="font-display text-xl font-bold text-[#3B2318]">
                Order Confirmed — Proceed to Window {order.serviceWindow}
              </h2>
              <p className="text-xs text-[#7A6357]">
                Please keep your Order ID ({order.orderId}) and Token #{order.tokenNumber} ready for pickup.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close confirmation"
            className="p-2 rounded-full text-[#7A6357] hover:text-[#3B2318] hover:bg-[#F4EDE0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <ReceiptCard order={order} />

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 no-print">
            <button
              type="button"
              onClick={() => onViewInLookup(order.orderId)}
              className="px-5 py-2.5 rounded-full border border-[#E8DFD1] bg-[#FFFDF9] text-sm font-medium text-[#3B2318] hover:border-[#3B2318] transition-colors cursor-pointer"
            >
              Open in Bill Lookup
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#3B2318] text-[#FAF6EE] text-sm font-semibold hover:bg-[#523224] transition-colors cursor-pointer"
            >
              Continue Ordering
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
