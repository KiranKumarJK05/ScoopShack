import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle, Receipt, Search } from 'lucide-react';
import { ApiError, scoopShackApi } from '../services/api';
import { Order } from '../types/scoopshack';
import { ReceiptCard } from './ReceiptCard';

interface BillLookupPageProps {
  initialOrderId?: string | null;
  recentOrderIds: string[];
}

export function BillLookupPage({
  initialOrderId,
  recentOrderIds,
}: BillLookupPageProps) {
  const [queryId, setQueryId] = useState(initialOrderId ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  const performLookup = async (targetId: string) => {
    const cleaned = targetId.trim().toUpperCase();
    if (!cleaned) {
      setError('Please enter an Order ID (for example ICE1).');
      setFoundOrder(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const order = await scoopShackApi.getOrder(cleaned);
      setFoundOrder(order);
    } catch (err) {
      setFoundOrder(null);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to retrieve the bill right now. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setQueryId(initialOrderId);
      void performLookup(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void performLookup(queryId);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="pb-8 border-b border-[#E8DFD1] no-print">
        <p className="text-sm font-medium text-[#5F8264]">Receipt Archive</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#3B2318] tracking-tight">
          Previous Bill Lookup
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#7A6357]">
          Enter any sequential Order ID (such as ICE1 or ICE2) to retrieve the saved receipt, counter token, and itemized GST breakdown.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-[#7A6357] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              placeholder="Enter Order ID (e.g. ICE1)"
              aria-label="Order ID"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#E8DFD1] font-mono text-sm text-[#3B2318] placeholder:text-[#A39387] uppercase focus:outline-none focus:ring-2 focus:ring-[#D9546B]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#3B2318] text-[#FAF6EE] text-sm font-semibold hover:bg-[#523224] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loading ? 'Searching...' : 'Retrieve Bill'}
          </button>
        </form>

        {recentOrderIds.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#7A6357]">
            <span>Recent bills:</span>
            {recentOrderIds.slice(0, 6).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setQueryId(id);
                  void performLookup(id);
                }}
                className="px-2.5 py-1 rounded-md bg-[#F4EDE0] border border-[#E8DFD1] font-mono text-[#3B2318] hover:border-[#3B2318] transition-colors cursor-pointer"
              >
                {id}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-[#FDF2F4] border border-[#F5C2CB] flex items-start gap-2.5 text-sm text-[#9F1239]"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && !foundOrder && (
          <div className="p-12 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1] text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F4EDE0] flex items-center justify-center text-[#7A6357]">
              <Receipt className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-[#3B2318]">
              Ready to look up a saved bill
            </h2>
            <p className="mt-1.5 text-sm text-[#7A6357] max-w-md mx-auto">
              Place an order from the Menu or enter an existing Order ID above to display the full receipt.
            </p>
          </div>
        )}

        {foundOrder && <ReceiptCard order={foundOrder} />}
      </div>
    </section>
  );
}
