package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class ActiveLoanExistsException extends RuntimeException {
    public ActiveLoanExistsException(String message) {
        super(message);
    }
}
