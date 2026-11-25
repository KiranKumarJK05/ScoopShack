
package com.scoopshack.backend;

import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final MenuItem[] menu = {
            new MenuItem(101, "Vanilla Scoop", "Scoop", 60, 40),
            new MenuItem(102, "Chocolate Sundae", "Sundae", 150, 20),
            new MenuItem(103, "Mango Shake", "Shake", 120, 25),
            new MenuItem(104, "Kulfi Stick", "Kulfi", 50, 30),
            new MenuItem(105, "Brownie with Ice Cream", "Dessert", 180, 15),
            new MenuItem(106, "Family Pack 1 L", "Pack", 350, 10)
    };

    private Order[] orders = new Order[1000];
    private int orderCount = 0;

    private static int orderCounter = 0;
    private static final double GST = 0.18;

    public MenuItem[] getMenu() {
        return menu;
    }

    // CREATE NEW ORDER
    public Order createOrder(OrderRequest request) {

        if (request == null ||
                request.getCustomerName() == null ||
                request.getCustomerName().trim().length() < 2 ||
                request.getItems() == null ||
                request.getItems().length == 0) {

            throw new IllegalArgumentException("Invalid order details.");
        }

        String customerType = request.getCustomerType();

        if (!"REGULAR".equals(customerType) &&
                !"STUDENT".equals(customerType)) {

            throw new IllegalArgumentException("Invalid customer type.");
        }

        OrderItemRequest[] requestedItems = request.getItems();
        int[] quantities = new int[menu.length];

        // Validate every item before changing stock
        for (OrderItemRequest line : requestedItems) {

            if (line == null || line.getQuantity() <= 0) {
                throw new IllegalArgumentException(
                        "Quantity must be a positive number.");
            }

            int index = findMenuIndex(line.getItemId());

            if (index == -1) {
                throw new IllegalArgumentException(
                        "Menu item " + line.getItemId() + " was not found.");
            }

            quantities[index] += line.getQuantity();
        }

        // Check available stock
        for (int i = 0; i < menu.length; i++) {

            if (quantities[i] > menu[i].getStock()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for " + menu[i].getName());
            }
        }

        // Count distinct ordered items
        int distinctCount = 0;

        for (int quantity : quantities) {
            if (quantity > 0) {
                distinctCount++;
            }
        }

        OrderLineItem[] lines = new OrderLineItem[distinctCount];

        int lineCount = 0;
        double subtotal = 0;

        for (int i = 0; i < menu.length; i++) {

            if (quantities[i] > 0) {

                MenuItem item = menu[i];

                lines[lineCount++] = new OrderLineItem(
                        item.getId(),
                        item.getName(),
                        item.getCategory(),
                        item.getPrice(),
                        quantities[i]);

                subtotal += item.getPrice() * quantities[i];
            }
        }

        // Deduct stock after successful validation
        for (int i = 0; i < menu.length; i++) {

            if (quantities[i] > 0) {
                menu[i].setStock(
                        menu[i].getStock() - quantities[i]);
            }
        }

        orderCounter++;

        String orderId = "ICE" + orderCounter;
        int token = orderCounter;
        int window = (token & 1) == 1 ? 1 : 2;

        double discountRate = "STUDENT".equals(customerType) ? 0.05 : 0.0;

        double discount = round(subtotal * discountRate);
        double taxable = round(subtotal - discount);
        double gstAmount = round(taxable * GST);
        double total = round(taxable + gstAmount);

        Order order = new Order(
                orderId,
                token,
                window,
                request.getCustomerName().trim(),
                customerType,
                discountRate,
                lines,
                round(subtotal),
                discount,
                taxable,
                GST,
                gstAmount,
                total);

        if (orderCount < orders.length) {
            orders[orderCount++] = order;
        }

        return order;
    }

    // FIND OLD BILL
    public Order getOrder(String orderId) {

        for (int i = 0; i < orderCount; i++) {

            if (orders[i].getOrderId().equalsIgnoreCase(orderId)) {
                return orders[i];
            }
        }

        throw new IllegalArgumentException(
                "No bill found for Order ID: " + orderId);
    }

    // SALES REPORT
    public SalesReport getSalesReport() {

        int totalUnitsSold = 0;

        double totalSubtotal = 0;
        double totalDiscounts = 0;
        double totalGst = 0;
        double totalRevenue = 0;

        int[] unitsSold = new int[menu.length];
        double[] itemRevenue = new double[menu.length];

        for (int i = 0; i < orderCount; i++) {

            Order order = orders[i];

            totalSubtotal += order.getSubtotal();
            totalDiscounts += order.getDiscountAmount();
            totalGst += order.getGstAmount();
            totalRevenue += order.getFinalTotal();

            for (OrderLineItem line : order.getItems()) {

                if (line == null) {
                    continue;
                }

                int index = findMenuIndex(line.getItemId());

                if (index != -1) {

                    unitsSold[index] += line.getQuantity();
                    itemRevenue[index] += line.getLineTotal();

                    totalUnitsSold += line.getQuantity();
                }
            }
        }

        // Find most popular item
        PopularProductStat mostPopular = null;
        int highestUnits = 0;

        for (int i = 0; i < menu.length; i++) {

            if (unitsSold[i] > highestUnits) {

                highestUnits = unitsSold[i];

                mostPopular = new PopularProductStat(
                        menu[i].getId(),
                        menu[i].getName(),
                        menu[i].getCategory(),
                        unitsSold[i],
                        round(itemRevenue[i]));
            }
        }

        // Find low-stock items
        int lowCount = 0;

        for (MenuItem item : menu) {

            if (item.getStock() < 10) {
                lowCount++;
            }
        }

        MenuItem[] lowStock = new MenuItem[lowCount];
        int lowIndex = 0;

        for (MenuItem item : menu) {

            if (item.getStock() < 10) {
                lowStock[lowIndex++] = item;
            }
        }

        // Recent orders, newest first
        Order[] recentOrders = new Order[orderCount];

        for (int i = 0; i < orderCount; i++) {
            recentOrders[i] = orders[orderCount - 1 - i];
        }

        return new SalesReport(
                orderCount,
                totalUnitsSold,
                round(totalSubtotal),
                round(totalDiscounts),
                round(totalGst),
                round(totalRevenue),
                mostPopular,
                lowStock,
                recentOrders);
    }

    // FIND MENU ITEM POSITION
    private int findMenuIndex(int itemId) {

        for (int i = 0; i < menu.length; i++) {

            if (menu[i].getId() == itemId) {
                return i;
            }
        }

        return -1;
    }

    // ROUND TO TWO DECIMAL PLACES
    private double round(double amount) {
        return Math.round(amount * 100.0) / 100.0;
    }
}
