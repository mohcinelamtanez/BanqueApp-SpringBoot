package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class InvalidRegistrationException extends RuntimeException {
    public InvalidRegistrationException(String message) {
        super(message);
    }
}
