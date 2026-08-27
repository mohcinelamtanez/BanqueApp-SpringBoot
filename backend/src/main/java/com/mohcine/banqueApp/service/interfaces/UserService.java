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

}
