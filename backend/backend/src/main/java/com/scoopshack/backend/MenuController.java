
package com.scoopshack.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://scoopshack-4e6ox0xqg-terraspace-explorer.vercel.app"
})
public class MenuController {

    private final OrderService orderService;

    public MenuController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/menu")
    public MenuItem[] getMenu() {
        return orderService.getMenu();
    }
}
