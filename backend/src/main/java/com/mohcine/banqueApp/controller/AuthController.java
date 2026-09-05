package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.LoginRequestDTO;
import com.mohcine.banqueApp.dto.LoginResponseDTO;
import com.mohcine.banqueApp.entity.Role;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.service.interfaces.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author USER
 **/
@Tag(name = "authentication")
@RestController
@RequestMapping("api/v1/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "authenticates a user and returns a JWT")
    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {
        User credentials = new User();
        credentials.setUsername(request.getEmail());
        credentials.setPassword(request.getPassword());

        String token = userService.signIn(credentials);
        User authenticated = (User) userService.loadUserByUsername(request.getEmail());

        String role = authenticated.getAuthorities().stream()
                .findFirst()
                .map(Role::getAuthority)
                .map(authority -> authority.startsWith("ROLE_")
                        ? authority.substring("ROLE_".length())
                        : authority)
                .orElse(null);
        String clientReference = authenticated.getClient() != null
                ? authenticated.getClient().getClientReference()
                : null;

        return new LoginResponseDTO(token, authenticated.getUsername(), role, clientReference);
    }
}
