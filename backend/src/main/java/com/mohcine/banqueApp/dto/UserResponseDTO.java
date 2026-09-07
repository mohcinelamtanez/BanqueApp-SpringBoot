package com.mohcine.banqueApp.dto;

/**
 * Admin-facing representation of a User account. Only what actually exists
 * on the User entity (email, role, enabled) — no name/phone/last-login
 * fields are invented, since the entity doesn't track them.
 *
 * @author USER
 **/
public record UserResponseDTO(
        Integer id,
        String email,
        String role,
        boolean enabled
) {
}
