package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.LoginRequestDTO;
import com.mohcine.banqueApp.dto.LoginResponseDTO;
import com.mohcine.banqueApp.dto.RegisterRequestDTO;
import com.mohcine.banqueApp.entity.Role;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.exception.InvalidRegistrationException;
import com.mohcine.banqueApp.exception.UserAlreadyExistsException;
import com.mohcine.banqueApp.service.interfaces.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    // Public self-registration always creates a CLIENT-role account — there
    // is no way for the caller to request a different role here. Does not
    // log the new user in (no token returned): they sign in separately
    // afterward, through the existing /login endpoint above. The User <->
    // Client relationship is intentionally not created here — a separate,
    // later task owns that.
    @Operation(summary = "registers a new user account with the default CLIENT role")
    @PostMapping("/register")
    public LoginResponseDTO register(@RequestBody RegisterRequestDTO request) {
        if (request.getEmail() == null || request.getEmail().isBlank()
                || !request.getEmail().contains("@")) {
            throw new InvalidRegistrationException("Enter a valid email address.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new InvalidRegistrationException("Password must be at least 8 characters long.");
        }

        Role clientRole = new Role();
        clientRole.setAuthority("ROLE_CLIENT");

        User newUser = new User();
        newUser.setUsername(request.getEmail());
        newUser.setPassword(request.getPassword());
        newUser.setAuthorities(List.of(clientRole));

        User saved = userService.save(newUser);
        if (saved == null) {
            throw new UserAlreadyExistsException();
        }

        return new LoginResponseDTO(null, saved.getUsername(), "CLIENT", null);
    }
}
