package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException() {
        super("An account with this email already exists.");
    }
}
