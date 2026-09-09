package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

/**
 * @author USER
 **/
public interface UserService extends UserDetailsService {
    String signIn(User user);

    User save(User user);
    List<User> findAll();

    // Admin-only self-service role management: an Admin may only ever
    // assign ROLE_BANK_AGENT or ROLE_CLIENT this way — never ROLE_ADMIN,
    // which stays out of this feature entirely (see UserServiceImpl).
    User assignRole(Integer userId, String role);

}
