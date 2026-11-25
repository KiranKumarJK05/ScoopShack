
package com.scoopshack.backend;

public class PopularProductStat {

    private int itemId;
    private String itemName;
    private String category;
    private int unitsSold;
    private double revenue;

    public PopularProductStat(
            int itemId,
            String itemName,
            String category,
            int unitsSold,
            double revenue) {

        this.itemId = itemId;
        this.itemName = itemName;
        this.category = category;
        this.unitsSold = unitsSold;
        this.revenue = revenue;
    }

    public int getItemId() {
        return itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public String getCategory() {
        return category;
    }

    public int getUnitsSold() {
        return unitsSold;
    }

    public double getRevenue() {
        return revenue;
    }
}
