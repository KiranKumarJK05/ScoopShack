
package com.scoopshack.backend;

import java.time.LocalDateTime;
import java.util.List;

public class Order {
    private String orderId;
    private int tokenNumber;
    private int serviceWindow;
    private String customerName;
    private String customerType;
    private double discountRate;
    private OrderLineItem[] items;
    private double subtotal;
    private double discountAmount;
    private double taxableAmount;
    private double gstRate;
    private double gstAmount;
    private double finalTotal;
    private String createdAt;

    public Order(String orderId, int tokenNumber,
            int serviceWindow, String customerName,
            String customerType, double discountRate,
            OrderLineItem[] items, double subtotal,
            double discountAmount, double taxableAmount,
            double gstRate, double gstAmount,
            double finalTotal) {

        this.orderId = orderId;
        this.tokenNumber = tokenNumber;
        this.serviceWindow = serviceWindow;
        this.customerName = customerName;
        this.customerType = customerType;
        this.discountRate = discountRate;
        this.items = items;
        this.subtotal = subtotal;
        this.discountAmount = discountAmount;
        this.taxableAmount = taxableAmount;
        this.gstRate = gstRate;
        this.gstAmount = gstAmount;
        this.finalTotal = finalTotal;
        this.createdAt = LocalDateTime.now().toString();
    }

    public String getOrderId() {
        return orderId;
    }

    public int getTokenNumber() {
        return tokenNumber;
    }

    public int getServiceWindow() {
        return serviceWindow;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerType() {
        return customerType;
    }

    public double getDiscountRate() {
        return discountRate;
    }

    public OrderLineItem[] getItems() {
        return items;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public double getDiscountAmount() {
        return discountAmount;
    }

    public double getTaxableAmount() {
        return taxableAmount;
    }

    public double getGstRate() {
        return gstRate;
    }

    public double getGstAmount() {
        return gstAmount;
    }

    public double getFinalTotal() {
        return finalTotal;
    }

    public String getCreatedAt() {
        return createdAt;
    }
}
