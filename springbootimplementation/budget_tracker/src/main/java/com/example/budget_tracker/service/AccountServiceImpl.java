package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.Account;
import com.example.budget_tracker.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository repo;

    public AccountServiceImpl(AccountRepository repo) {
        this.repo = repo;
    }

    public Account saveAccount(Account account) {
        return repo.save(account);
    }

    public List<Account> getAllAccounts() {
        return repo.findAll();
    }

    public Account getAccountById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public void deleteAccount(Integer id) {
        repo.deleteById(id);
    }
}
