package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Role;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.exception.InvalidRoleException;
import com.mohcine.banqueApp.exception.UserNotFoundException;
import com.mohcine.banqueApp.repository.UserRepository;
import com.mohcine.banqueApp.service.interfaces.RoleService;
import com.mohcine.banqueApp.service.interfaces.UserService;
import com.mohcine.banqueApp.service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * @author USER
 **/

@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;

    private RoleService roleService;

    private final PasswordEncoder passwordEncoder;

    @Lazy
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

     public UserServiceImpl(UserRepository userRepository,
                            PasswordEncoder passwordEncoder ,
                            AuthenticationManager authenticationManager ,
                            JwtUtil jwtUtil) {
         this.userRepository = userRepository;
         this.passwordEncoder = passwordEncoder;
         this.authenticationManager = authenticationManager;
         this.jwtUtil = jwtUtil;
     }

    @Override
    public String signIn(User user) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    user.getUsername(), user.getPassword()
            ));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("bad credentiel for username " + user.getUsername());
        }
        User loadUserByUsername = loadUserByUsername(user.getUsername());
        String token = jwtUtil.generateToken(loadUserByUsername);
        return token;
    }

    @Override
    public User save(User user) {
        User loadedUser = userRepository.findByEmail(user.getUsername());
        if (loadedUser != null)
            return null;
        else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            roleService.save(user.getAuthorities());
            userRepository.save(user);
            return user;
        }
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    private static final Set<String> ASSIGNABLE_ROLES = Set.of("BANK_AGENT", "CLIENT");

    // Deliberately narrower than the full Role model: ROLE_ADMIN is never
    // reachable through this method, so promoting a user to Admin is not
    // something this feature can do — that stays outside self-service admin
    // user management.
    @Override
    public User assignRole(Integer userId, String role) {
        if (role == null || !ASSIGNABLE_ROLES.contains(role)) {
            throw new InvalidRoleException("Role must be either BANK_AGENT or CLIENT.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Role newRole = new Role();
        newRole.setAuthority("ROLE_" + role);
        Role resolvedRole = roleService.save(newRole);

        // Unlike register()'s brand-new (not-yet-persisted) User, this user
        // was loaded from the DB — its `authorities` collection is a
        // Hibernate-managed persistent collection. Replacing it with an
        // immutable List.of(...) throws UnsupportedOperationException once
        // Hibernate tries to reconcile it against the user_roles join table
        // on flush; a mutable list works.
        user.setAuthorities(new ArrayList<>(List.of(resolvedRole)));
        return userRepository.save(user);
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if (user == null || user.getId() == null) {
            throw new UsernameNotFoundException("user " + username + " not founded");
        } else {
            return user;
        }
    }
}
