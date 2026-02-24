package com.example.budget_tracker.controller;

import com.example.budget_tracker.entity.Account;
import com.example.budget_tracker.service.AccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    @PostMapping
    public Account saveAccount(@RequestBody Account account) {
        return service.saveAccount(account);
    }

    @GetMapping
    public List<Account> getAllAccounts() {
        return service.getAllAccounts();
    }

    @GetMapping("/{id}")
    public Account getAccount(@PathVariable Integer id) {
        return service.getAccountById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteAccount(@PathVariable Integer id) {
        service.deleteAccount(id);
    }
}
