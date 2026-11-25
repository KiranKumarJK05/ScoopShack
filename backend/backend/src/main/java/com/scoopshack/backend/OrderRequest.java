
package com.scoopshack.backend;

public class OrderRequest {
    private String customerName;
    private String customerType;
    private OrderItemRequest[] items;

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerType() {
        return customerType;
    }

    public void setCustomerType(String customerType) {
        this.customerType = customerType;
    }

    public OrderItemRequest[] getItems() {
        return items;
    }

    public void setItems(OrderItemRequest[] items) {
        this.items = items;
    }
}
