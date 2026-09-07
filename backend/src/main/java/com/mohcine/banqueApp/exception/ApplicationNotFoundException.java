package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class ApplicationNotFoundException extends RuntimeException {
    public ApplicationNotFoundException(Integer applicationId) {
        super("Application not found with id " + applicationId);
    }
}
