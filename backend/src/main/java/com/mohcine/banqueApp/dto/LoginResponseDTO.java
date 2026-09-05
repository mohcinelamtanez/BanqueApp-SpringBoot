package com.mohcine.banqueApp.dto;

/**
 * @author USER
 **/
public class LoginResponseDTO {
    private String token;
    private String email;
    // Role authorities are seeded/stored as "ROLE_ADMIN" etc. (Spring
    // convention) — the "ROLE_" prefix is stripped here so the frontend can
    // compare it directly against its own ROLES.ADMIN/BANK_AGENT/CLIENT.
    private String role;
    // Only set when the authenticated user is linked to a Client row — lets
    // the Client portal know which client's data to load, instead of a
    // hardcoded placeholder reference.
    private String clientReference;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(String token, String email, String role, String clientReference) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.clientReference = clientReference;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getClientReference() {
        return clientReference;
    }

    public void setClientReference(String clientReference) {
        this.clientReference = clientReference;
    }
}
