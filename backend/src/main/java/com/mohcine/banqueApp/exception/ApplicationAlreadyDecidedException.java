package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class ApplicationAlreadyDecidedException extends RuntimeException {
    public ApplicationAlreadyDecidedException(String message) {
        super(message);
    }
}
