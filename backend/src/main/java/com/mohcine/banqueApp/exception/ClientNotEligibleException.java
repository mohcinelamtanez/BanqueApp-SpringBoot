package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class ClientNotEligibleException extends RuntimeException {
    public ClientNotEligibleException(String message) {
        super(message);
    }
}
