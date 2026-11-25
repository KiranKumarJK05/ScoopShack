
package com.scoopshack.backend;

public class MenuItem {

    private int id;
    private String name;
    private String category;
    private double price;
    private int stock;

    public MenuItem(int id, String name, String category,
            double price, int stock) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.stock = stock;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public double getPrice() {
        return price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getStockStatus() {
        return stock < 10 ? "LOW" : "OK";
    }
}
