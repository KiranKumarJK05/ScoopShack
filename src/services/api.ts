import { OFFICIAL_MENU_ITEMS } from '../data/officialMenu';
import {
  CreateOrderRequest,
  MenuItem,
  Order,
  OrderLineItem,
  PopularProductStat,
  SalesReport,
} from '../types/scoopshack';

export type ApiErrorCode =
  | 'MENU_ITEM_NOT_FOUND'
  | 'INSUFFICIENT_STOCK'
  | 'INVALID_ORDER'
  | 'ORDER_NOT_FOUND'
  | 'BACKEND_UNAVAILABLE';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(message: string, code: ApiErrorCode, status = 400) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

function resolveApiBaseUrl(): string {
  const raw =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.VITE_API_BASE_URL as string | undefined)
      : undefined;
  const trimmed = (raw ?? '').trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
    return '';
  }
  return trimmed.replace(/\/+$/, '');
}

const API_BASE_URL = resolveApiBaseUrl();
const STORAGE_KEY = 'scoopshack_mock_state_v1';
const GST_RATE = 0.18;

interface MockPersistedState {
  menuStocks: Record<number, number>;
  orders: Order[];
  orderCounter: number;
}

function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function getStockStatus(stock: number): 'LOW' | 'OK' {
  return stock < 10 ? 'LOW' : 'OK';
}

function getInitialMockState(): MockPersistedState {
  const menuStocks: Record<number, number> = {};
  for (const item of OFFICIAL_MENU_ITEMS) {
    menuStocks[item.id] = item.stock;
  }
  return {
    menuStocks,
    orders: [],
    orderCounter: 0,
  };
}

function loadMockState(): MockPersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialMockState();
    const parsed = JSON.parse(raw) as MockPersistedState;
    if (!parsed || typeof parsed.menuStocks !== 'object' || !Array.isArray(parsed.orders)) {
      return getInitialMockState();
    }
    // Ensure all official item IDs exist in state
    const mergedStocks: Record<number, number> = {};
    for (const item of OFFICIAL_MENU_ITEMS) {
      const stored = parsed.menuStocks[item.id];
      mergedStocks[item.id] = typeof stored === 'number' && stored >= 0 ? stored : item.stock;
    }
    return {
      menuStocks: mergedStocks,
      orders: parsed.orders,
      orderCounter: typeof parsed.orderCounter === 'number' ? parsed.orderCounter : parsed.orders.length,
    };
  } catch {
    return getInitialMockState();
  }
}

function saveMockState(state: MockPersistedState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in private browsing
  }
}

function hydrateMenu(state: MockPersistedState): MenuItem[] {
  return OFFICIAL_MENU_ITEMS.map((item) => {
    const currentStock = state.menuStocks[item.id] ?? item.stock;
    return {
      ...item,
      stock: currentStock,
      stockStatus: getStockStatus(currentStock),
    };
  });
}

async function delay(ms = 140): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
    });

    if (!response.ok) {
      let message = 'Unable to complete the request. Please try again.';
      let code: ApiErrorCode = 'INVALID_ORDER';
      try {
        const body = (await response.json()) as { message?: string; code?: ApiErrorCode };
        if (body.message) message = body.message;
        if (body.code) code = body.code;
      } catch {
        // Non-JSON error body
      }
      throw new ApiError(message, code, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Unable to reach the ScoopShack server right now. Please try again in a moment.',
      'BACKEND_UNAVAILABLE',
      503,
    );
  }
}

export const scoopShackApi = {
  isUsingRemoteBackend(): boolean {
    return API_BASE_URL.length > 0;
  },

  async getMenu(): Promise<MenuItem[]> {
    if (API_BASE_URL) {
      const remoteItems = await requestJson<Array<Partial<MenuItem> & { id: number }>>('/api/menu');
      return remoteItems.map((remote) => {
        const official = OFFICIAL_MENU_ITEMS.find((item) => item.id === remote.id);
        const stock = typeof remote.stock === 'number' ? remote.stock : official?.stock ?? 0;
        return {
          id: remote.id,
          name: remote.name ?? official?.name ?? `Item ${remote.id}`,
          category: (remote.category ?? official?.category ?? 'Scoop') as MenuItem['category'],
          price: typeof remote.price === 'number' ? remote.price : official?.price ?? 0,
          stock,
          stockStatus: remote.stockStatus ?? getStockStatus(stock),
          description: official?.description ?? '',
          tastingNotes: official?.tastingNotes ?? '',
          imageUrl: official?.imageUrl ?? '',
        };
      });
    }

    await delay(120);
    const state = loadMockState();
    return hydrateMenu(state);
  },

  async getMenuItem(id: number): Promise<MenuItem> {
    if (API_BASE_URL) {
      const remote = await requestJson<Partial<MenuItem> & { id: number }>(`/api/menu/${id}`);
      const official = OFFICIAL_MENU_ITEMS.find((item) => item.id === remote.id);
      const stock = typeof remote.stock === 'number' ? remote.stock : official?.stock ?? 0;
      return {
        id: remote.id,
        name: remote.name ?? official?.name ?? `Item ${remote.id}`,
        category: (remote.category ?? official?.category ?? 'Scoop') as MenuItem['category'],
        price: typeof remote.price === 'number' ? remote.price : official?.price ?? 0,
        stock,
        stockStatus: remote.stockStatus ?? getStockStatus(stock),
        description: official?.description ?? '',
        tastingNotes: official?.tastingNotes ?? '',
        imageUrl: official?.imageUrl ?? '',
      };
    }

    await delay(80);
    const state = loadMockState();
    const item = hydrateMenu(state).find((entry) => entry.id === id);
    if (!item) {
      throw new ApiError(
        `Menu item #${id} was not found in the ScoopShack catalog.`,
        'MENU_ITEM_NOT_FOUND',
        404,
      );
    }
    return item;
  },

  async createOrder(payload: CreateOrderRequest): Promise<Order> {
    const trimmedName = payload.customerName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      throw new ApiError(
        'Please enter a valid customer name (at least 2 characters).',
        'INVALID_ORDER',
        400,
      );
    }
    if (payload.customerType !== 'REGULAR' && payload.customerType !== 'STUDENT') {
      throw new ApiError(
        'Please select a valid customer type (Regular or Student).',
        'INVALID_ORDER',
        400,
      );
    }
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      throw new ApiError(
        'Your bag is empty. Add at least one ice cream item before placing an order.',
        'INVALID_ORDER',
        400,
      );
    }

    if (API_BASE_URL) {
      return requestJson<Order>('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName: trimmedName,
          customerType: payload.customerType,
          items: payload.items,
        }),
      });
    }

    await delay(180);
    const state = loadMockState();

    // Aggregate quantities per item ID so duplicate lines still enforce combined stock
    const aggregatedQuantities = new Map<number, number>();
    for (const line of payload.items) {
      if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
        throw new ApiError(
          'Quantities must be positive whole numbers.',
          'INVALID_ORDER',
          400,
        );
      }
      aggregatedQuantities.set(
        line.itemId,
        (aggregatedQuantities.get(line.itemId) ?? 0) + line.quantity,
      );
    }

    // Phase 1: Validate every item & stock atomically before mutating state
    const lineItems: OrderLineItem[] = [];
    for (const [itemId, quantity] of aggregatedQuantities.entries()) {
      const official = OFFICIAL_MENU_ITEMS.find((m) => m.id === itemId);
      if (!official) {
        throw new ApiError(
          `Menu item #${itemId} does not exist. Please check the item ID and try again.`,
          'MENU_ITEM_NOT_FOUND',
          404,
        );
      }
      const available = state.menuStocks[itemId] ?? official.stock;
      if (quantity > available) {
        throw new ApiError(
          `Insufficient stock for ${official.name}: requested ${quantity}, but only ${available} remaining.`,
          'INSUFFICIENT_STOCK',
          409,
        );
      }

      lineItems.push({
        itemId: official.id,
        itemName: official.name,
        category: official.category,
        unitPrice: official.price,
        quantity,
        lineTotal: roundMoney(official.price * quantity),
      });
    }

    // Phase 2: All items valid — deduct stock & generate sequential ICE ID + token
    for (const [itemId, quantity] of aggregatedQuantities.entries()) {
      state.menuStocks[itemId] = (state.menuStocks[itemId] ?? 0) - quantity;
    }

    const nextNumber = state.orderCounter + 1;
    state.orderCounter = nextNumber;

    const orderId = `ICE${nextNumber}`;
    const tokenNumber = nextNumber;
    const serviceWindow: 1 | 2 = (tokenNumber & 1) === 1 ? 1 : 2;

    const discountRate = payload.customerType === 'STUDENT' ? 0.05 : 0.0;
    const subtotal = roundMoney(lineItems.reduce((sum, item) => sum + item.lineTotal, 0));
    const discountAmount = roundMoney(subtotal * discountRate);
    const taxableAmount = roundMoney(subtotal - discountAmount);
    const gstAmount = roundMoney(taxableAmount * GST_RATE);
    const finalTotal = roundMoney(taxableAmount + gstAmount);

    const newOrder: Order = {
      orderId,
      tokenNumber,
      serviceWindow,
      customerName: trimmedName,
      customerType: payload.customerType,
      discountRate,
      items: lineItems,
      subtotal,
      discountAmount,
      taxableAmount,
      gstRate: GST_RATE,
      gstAmount,
      finalTotal,
      createdAt: new Date().toISOString(),
    };

    state.orders.unshift(newOrder);
    saveMockState(state);

    return newOrder;
  },

  async getOrder(orderId: string): Promise<Order> {
    const normalized = orderId.trim().toUpperCase();
    if (!normalized) {
      throw new ApiError('Please enter an Order ID such as ICE1.', 'INVALID_ORDER', 400);
    }

    if (API_BASE_URL) {
      return requestJson<Order>(`/api/orders/${encodeURIComponent(normalized)}`);
    }

    await delay(120);
    const state = loadMockState();
    const found = state.orders.find((order) => order.orderId.toUpperCase() === normalized);
    if (!found) {
      throw new ApiError(
        `No saved bill found for Order ID "${normalized}". Check the ID (for example ICE1) and try again.`,
        'ORDER_NOT_FOUND',
        404,
      );
    }
    return found;
  },

  async getSalesReport(): Promise<SalesReport> {
    if (API_BASE_URL) {
      return requestJson<SalesReport>('/api/reports/sales');
    }

    await delay(120);
    const state = loadMockState();
    const menu = hydrateMenu(state);

    let totalUnitsSold = 0;
    let totalSubtotal = 0;
    let totalDiscounts = 0;
    let totalGst = 0;
    let totalRevenue = 0;

    const itemStats = new Map<number, PopularProductStat>();

    for (const order of state.orders) {
      totalSubtotal = roundMoney(totalSubtotal + order.subtotal);
      totalDiscounts = roundMoney(totalDiscounts + order.discountAmount);
      totalGst = roundMoney(totalGst + order.gstAmount);
      totalRevenue = roundMoney(totalRevenue + order.finalTotal);

      for (const line of order.items) {
        totalUnitsSold += line.quantity;
        const existing = itemStats.get(line.itemId);
        if (existing) {
          existing.unitsSold += line.quantity;
          existing.revenue = roundMoney(existing.revenue + line.lineTotal);
        } else {
          itemStats.set(line.itemId, {
            itemId: line.itemId,
            itemName: line.itemName,
            category: line.category,
            unitsSold: line.quantity,
            revenue: line.lineTotal,
          });
        }
      }
    }

    let mostPopularItem: PopularProductStat | null = null;
    for (const stat of itemStats.values()) {
      if (!mostPopularItem || stat.unitsSold > mostPopularItem.unitsSold) {
        mostPopularItem = stat;
      }
    }

    const lowStockItems = menu.filter((item) => item.stock < 10);

    return {
      totalOrders: state.orders.length,
      totalUnitsSold,
      totalSubtotal,
      totalDiscounts,
      totalGst,
      totalRevenue,
      mostPopularItem,
      lowStockItems,
      recentOrders: state.orders,
    };
  },

  async resetMockDemoData(): Promise<MenuItem[]> {
    const fresh = getInitialMockState();
    saveMockState(fresh);
    return hydrateMenu(fresh);
  },
};

export function formatINR(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}
