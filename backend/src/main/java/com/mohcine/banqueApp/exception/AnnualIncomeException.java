package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class AnnualIncomeException extends RuntimeException {

    public AnnualIncomeException() {
        super("the annual income must not be null ") ;
    }
}
