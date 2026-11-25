import { Printer } from 'lucide-react';
import { Order } from '../types/scoopshack';
import { formatINR } from '../services/api';

interface ReceiptCardProps {
  order: Order;
  showPrintButton?: boolean;
}

export function ReceiptCard({ order, showPrintButton = true }: ReceiptCardProps) {
  const formattedTime = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E8DFD1]">
        <div>
          <p className="text-xs font-medium text-[#5F8264]">Official ScoopShack Bill</p>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#3B2318] font-mono tabular-nums">
            {order.orderId}
          </h3>
          <p className="mt-1 text-xs text-[#7A6357]">{formattedTime}</p>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-[#7A6357]">Token Number</p>
            <p className="font-mono tabular-nums text-2xl font-bold text-[#D9546B]">
              #{order.tokenNumber}
            </p>
          </div>
          <div className="pl-6 border-l border-[#E8DFD1]">
            <p className="text-xs text-[#7A6357]">Counter Dispatch</p>
            <p className="font-mono tabular-nums text-lg font-semibold text-[#3B2318]">
              Window {order.serviceWindow}
            </p>
            <p className="text-[11px] text-[#7A6357]">
              {order.serviceWindow === 1 ? 'Odd token lane' : 'Even token lane'}
            </p>
          </div>
        </div>
      </div>

      <div className="py-4 border-b border-[#E8DFD1] flex flex-wrap items-center justify-between gap-4 text-sm">
        <div>
          <span className="text-[#7A6357]">Customer: </span>
          <span className="font-semibold text-[#3B2318]">{order.customerName}</span>
        </div>
        <div>
          <span className="text-[#7A6357]">Category: </span>
          <span className="font-semibold text-[#3B2318]">
            {order.customerType === 'STUDENT' ? 'Student (5% Discount)' : 'Regular (0% Discount)'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto py-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[#7A6357] border-b border-[#E8DFD1]">
              <th className="pb-2.5 font-medium">Item</th>
              <th className="pb-2.5 font-medium text-right">Price</th>
              <th className="pb-2.5 font-medium text-right">Qty</th>
              <th className="pb-2.5 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD1]">
            {order.items.map((line) => (
              <tr key={line.itemId}>
                <td className="py-3 pr-3">
                  <p className="font-medium text-[#3B2318]">{line.itemName}</p>
                  <p className="text-xs text-[#7A6357] font-mono">
                    #{line.itemId} · {line.category}
                  </p>
                </td>
                <td className="py-3 text-right font-mono tabular-nums text-[#7A6357]">
                  {formatINR(line.unitPrice)}
                </td>
                <td className="py-3 text-right font-mono tabular-nums text-[#3B2318]">
                  {line.quantity}
                </td>
                <td className="py-3 text-right font-mono tabular-nums font-medium text-[#3B2318]">
                  {formatINR(line.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-[#E8DFD1] space-y-2 text-sm">
        <div className="flex justify-between text-[#7A6357]">
          <span>Subtotal</span>
          <span className="font-mono tabular-nums text-[#3B2318]">
            {formatINR(order.subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-[#7A6357]">
          <span>Discount ({Math.round(order.discountRate * 100)}%)</span>
          <span className="font-mono tabular-nums text-[#5F8264]">
            −{formatINR(order.discountAmount)}
          </span>
        </div>
        <div className="flex justify-between text-[#7A6357]">
          <span>Taxable Amount</span>
          <span className="font-mono tabular-nums text-[#3B2318]">
            {formatINR(order.taxableAmount)}
          </span>
        </div>
        <div className="flex justify-between text-[#7A6357]">
          <span>GST ({Math.round(order.gstRate * 100)}%)</span>
          <span className="font-mono tabular-nums text-[#3B2318]">
            {formatINR(order.gstAmount)}
          </span>
        </div>
        <div className="pt-3 border-t border-[#E8DFD1] flex justify-between items-baseline">
          <span className="font-display text-lg font-bold text-[#3B2318]">Final Total</span>
          <span className="font-mono tabular-nums text-2xl font-bold text-[#3B2318]">
            {formatINR(order.finalTotal)}
          </span>
        </div>
      </div>

      {showPrintButton && (
        <div className="mt-6 pt-4 border-t border-[#E8DFD1] flex justify-end no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8DFD1] text-xs font-medium text-[#3B2318] hover:border-[#3B2318] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print Receipt</span>
          </button>
        </div>
      )}
    </div>
  );
}
