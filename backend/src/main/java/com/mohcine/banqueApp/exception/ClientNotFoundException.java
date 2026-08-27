package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class ClientNotFoundException extends RuntimeException {
    public ClientNotFoundException(Integer clientId) {
        super("Client not found with id: " + clientId);
    }
}
