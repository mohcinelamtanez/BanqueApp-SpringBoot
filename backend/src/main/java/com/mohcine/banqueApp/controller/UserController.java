package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.AssignRoleRequest;
import com.mohcine.banqueApp.dto.UserResponseDTO;
import com.mohcine.banqueApp.entity.Role;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.service.interfaces.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @Operation(summary = "returns every user account")
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.findAll().stream()
                .map(this::toDTO)
                .toList();
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
