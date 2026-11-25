
package com.scoopshack.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class SalesController {

    private final OrderService orderService;

    public SalesController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/reports/sales")
    public SalesReport getSalesReport() {
        return orderService.getSalesReport();
    }
}
