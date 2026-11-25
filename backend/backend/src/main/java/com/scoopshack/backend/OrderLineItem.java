
package com.scoopshack.backend;

public class OrderLineItem {
    private int itemId;
    private String itemName;
    private String category;
    private double unitPrice;
    private int quantity;
    private double lineTotal;

    public OrderLineItem(int itemId, String itemName,
            String category, double unitPrice,
            int quantity) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.category = category;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.lineTotal = Math.round(unitPrice * quantity * 100.0) / 100.0;
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

    public double getUnitPrice() {
        return unitPrice;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getLineTotal() {
        return lineTotal;
    }
}
