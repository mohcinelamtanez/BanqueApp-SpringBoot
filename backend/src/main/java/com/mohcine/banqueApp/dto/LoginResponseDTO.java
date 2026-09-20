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
    // hardcoded placeholder id.
    private Integer clientId;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(String token, String email, String role, Integer clientId) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.clientId = clientId;
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

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }
}
