package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class ClientNotFoundException extends RuntimeException {
    public ClientNotFoundException(String clientReference) {
        super("Client not found with this Ref" + clientReference);
    }
}
