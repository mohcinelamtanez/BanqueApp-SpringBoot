package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.AdminCreateUserRequest;
import com.mohcine.banqueApp.dto.AssignRoleRequest;
import com.mohcine.banqueApp.dto.UserResponseDTO;
import com.mohcine.banqueApp.entity.Role;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.exception.InvalidRegistrationException;
import com.mohcine.banqueApp.exception.InvalidRoleException;
import com.mohcine.banqueApp.exception.UserAlreadyExistsException;
import com.mohcine.banqueApp.service.interfaces.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * Admin-only user management — listing accounts and assigning a role
 * (Bank Agent or Client). Access is restricted to ROLE_ADMIN in
 * SpringSecurityConfig, not just hidden in the frontend.
 *
 * @author USER
 **/
@Tag(name = "this endpoint allows an administrator to manage user accounts")
@RestController
@RequestMapping("api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private static final Set<String> CREATABLE_ROLES = Set.of("ADMIN", "BANK_AGENT", "CLIENT");

    @Operation(summary = "returns every user account")
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    // Add User — same validation/password-encoding path as public
    // self-registration (UserService.save), except the caller (an Admin)
    // picks the role instead of it always being CLIENT.
    @Operation(summary = "creates a new internal user account (Admin, Bank Agent or Client)")
    @PostMapping
    public UserResponseDTO createUser(@RequestBody AdminCreateUserRequest request) {
        if (request.email() == null || request.email().isBlank() || !request.email().contains("@")) {
            throw new InvalidRegistrationException("Enter a valid email address.");
        }
        if (request.password() == null || request.password().length() < 8) {
            throw new InvalidRegistrationException("Password must be at least 8 characters long.");
        }
        if (request.role() == null || !CREATABLE_ROLES.contains(request.role())) {
            throw new InvalidRoleException("Role must be one of ADMIN, BANK_AGENT, or CLIENT.");
        }

        Role role = new Role();
        role.setAuthority("ROLE_" + request.role());

        User newUser = new User();
        newUser.setUsername(request.email());
        newUser.setPassword(request.password());
        newUser.setAuthorities(List.of(role));

        User saved = userService.save(newUser);
        if (saved == null) {
            throw new UserAlreadyExistsException();
        }
        return toDTO(saved);
    }

    // Assigns the given user's role — always exactly one of BANK_AGENT or
    // CLIENT (see UserServiceImpl.assignRole); ROLE_ADMIN can never be
    // granted through this endpoint.
    @Operation(summary = "assigns a role (Bank Agent or Client) to a user")
    @PutMapping("/{id}/role")
    public UserResponseDTO assignRole(@PathVariable Integer id, @RequestBody AssignRoleRequest request) {
        User updated = userService.assignRole(id, request.role());
        return toDTO(updated);
    }

    private UserResponseDTO toDTO(User user) {
        String role = user.getAuthorities().stream()
                .findFirst()
                .map(Role::getAuthority)
                .map(authority -> authority.startsWith("ROLE_")
                        ? authority.substring("ROLE_".length())
                        : authority)
                .orElse(null);
        return new UserResponseDTO(user.getId(), user.getUsername(), role, user.isEnabled());
    }
}
