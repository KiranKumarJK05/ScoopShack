
package com.scoopshack.backend;

public class SalesReport {

    private int totalOrders;
    private int totalUnitsSold;
    private double totalSubtotal;
    private double totalDiscounts;
    private double totalGst;
    private double totalRevenue;
    private PopularProductStat mostPopularItem;
    private MenuItem[] lowStockItems;
    private Order[] recentOrders;

    public SalesReport(
            int totalOrders,
            int totalUnitsSold,
            double totalSubtotal,
            double totalDiscounts,
            double totalGst,
            double totalRevenue,
            PopularProductStat mostPopularItem,
            MenuItem[] lowStockItems,
            Order[] recentOrders) {

        this.totalOrders = totalOrders;
        this.totalUnitsSold = totalUnitsSold;
        this.totalSubtotal = totalSubtotal;
        this.totalDiscounts = totalDiscounts;
        this.totalGst = totalGst;
        this.totalRevenue = totalRevenue;
        this.mostPopularItem = mostPopularItem;
        this.lowStockItems = lowStockItems;
        this.recentOrders = recentOrders;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public int getTotalUnitsSold() {
        return totalUnitsSold;
    }

    public double getTotalSubtotal() {
        return totalSubtotal;
    }

    public double getTotalDiscounts() {
        return totalDiscounts;
    }

    public double getTotalGst() {
        return totalGst;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public PopularProductStat getMostPopularItem() {
        return mostPopularItem;
    }

    public MenuItem[] getLowStockItems() {
        return lowStockItems;
    }

    public Order[] getRecentOrders() {
        return recentOrders;
    }
}
