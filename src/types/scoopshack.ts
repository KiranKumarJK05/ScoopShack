export type MenuCategory = 'Scoop' | 'Sundae' | 'Shake' | 'Kulfi' | 'Dessert' | 'Pack';

export type StockStatus = 'LOW' | 'OK';

export type CustomerType = 'REGULAR' | 'STUDENT';

export type AppPage = 'home' | 'menu' | 'lookup' | 'staff';

export interface MenuItem {
  id: number;
  name: string;
  category: MenuCategory;
  price: number;
  stock: number;
  stockStatus: StockStatus;
  description: string;
  imageUrl: string;
  tastingNotes: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItemRequest {
  itemId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  customerType: CustomerType;
  items: OrderItemRequest[];
}

export interface OrderLineItem {
  itemId: number;
  itemName: string;
  category: MenuCategory;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  orderId: string;
  tokenNumber: number;
  serviceWindow: 1 | 2;
  customerName: string;
  customerType: CustomerType;
  discountRate: number;
  items: OrderLineItem[];
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  finalTotal: number;
  createdAt: string;
}

export interface PopularProductStat {
  itemId: number;
  itemName: string;
  category: MenuCategory;
  unitsSold: number;
  revenue: number;
}

export interface SalesReport {
  totalOrders: number;
  totalUnitsSold: number;
  totalSubtotal: number;
  totalDiscounts: number;
  totalGst: number;
  totalRevenue: number;
  mostPopularItem: PopularProductStat | null;
  lowStockItems: MenuItem[];
  recentOrders: Order[];
}
