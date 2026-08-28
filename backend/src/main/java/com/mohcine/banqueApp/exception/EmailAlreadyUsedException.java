package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class EmailAlreadyUsedException extends RuntimeException {
    public EmailAlreadyUsedException() {
        super("A client with this email already exists ") ;
    }
}
