package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.Account;
import java.util.List;

public interface AccountService {

    Account saveAccount(Account account);

    List<Account> getAllAccounts();

    Account getAccountById(Integer id);

    void deleteAccount(Integer id);
}
