package com.mohcine.banqueApp.dto;

/**
 * @author USER
 **/
public record AdminCreateUserRequest(String email, String password, String role) {
}
