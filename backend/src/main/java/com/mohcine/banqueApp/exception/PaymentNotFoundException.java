package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class PaymentNotFoundException extends RuntimeException {
    public PaymentNotFoundException(Integer paymentId) {
        super("Payment not found with id " + paymentId);
    }
}
