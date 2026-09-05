package com.mohcine.banqueApp.config;

import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Role;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.repository.ClientRepository;
import com.mohcine.banqueApp.repository.UserRepository;
import com.mohcine.banqueApp.service.interfaces.RoleService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * There is no user-registration endpoint exposed anywhere on this backend
 * (UserController doesn't exist), so there was previously no way to get a
 * single working set of credentials into the `users` table. This seeds the
 * three standard test accounts (mirroring the frontend's former mock users)
 * exactly once, idempotently, on startup.
 *
 * @author USER
 **/
@Component
public class AuthDataSeeder implements CommandLineRunner {

    private static final String DEFAULT_PASSWORD = "password";

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public AuthDataSeeder(UserRepository userRepository,
                           ClientRepository clientRepository,
                           RoleService roleService,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Role adminRole = ensureRole("ROLE_ADMIN");
        Role agentRole = ensureRole("ROLE_BANK_AGENT");
        Role clientRole = ensureRole("ROLE_CLIENT");

        ensureUser("admin@banqueapp.com", adminRole, null);
        ensureUser("agent@banqueapp.com", agentRole, null);

        Client firstClient = clientRepository.findByClientReference("CLI-1");
        ensureUser("client@banqueapp.com", clientRole, firstClient);
    }

    private Role ensureRole(String authority) {
        Role role = new Role();
        role.setAuthority(authority);
        return roleService.save(role);
    }

    private void ensureUser(String email, Role role, Client client) {
        if (userRepository.findByEmail(email) != null) return;
        User user = new User();
        user.setUsername(email);
        user.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        user.setAuthorities(List.of(role));
        user.setClient(client);
        userRepository.save(user);
    }
}
