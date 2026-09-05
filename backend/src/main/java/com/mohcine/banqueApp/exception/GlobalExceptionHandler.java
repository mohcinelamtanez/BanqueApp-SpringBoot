package com.mohcine.banqueApp.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

/**
 * @author USER
 **/
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ClientNotFoundException.class)
    public ResponseEntity<ApiError> handleClientNotFoundException(ClientNotFoundException exception , HttpServletRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError) ;

    }

    @ExceptionHandler(LoanNotFoundException.class)
    public ResponseEntity<ApiError> handleLoanNotFoundException(LoanNotFoundException exception , HttpServletRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError) ;

    }

    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<ApiError> handlePaymentNotFoundException(PaymentNotFoundException exception , HttpServletRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError) ;

    }

    @ExceptionHandler(ActiveLoanExistsException.class)
    public ResponseEntity<ApiError> handleActiveLoanExistsException(ActiveLoanExistsException exception , HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.CONFLICT).body(apiError) ;
    }

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<ApiError> handleEmailAlreadyUsedException(EmailAlreadyUsedException exception , HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.CONFLICT).body(apiError) ;
    }


    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<ApiError> handleBadCredentials(RuntimeException exception, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;

        ApiError apiError = new ApiError(LocalDateTime.now(),
                status.value(),
                status.name(),
                "Invalid email or password.",
                request.getRequestURI());

        return ResponseEntity.status(status).body(apiError);
    }

    @ExceptionHandler(ApplicationNotFoundException.class)
    public ResponseEntity<ApiError> handleApplicationNotFoundException(ApplicationNotFoundException exception , HttpServletRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError) ;
    }

    @ExceptionHandler(ApplicationAlreadyDecidedException.class)
    public ResponseEntity<ApiError> handleApplicationAlreadyDecidedException(ApplicationAlreadyDecidedException exception , HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.CONFLICT).body(apiError) ;
    }

    @ExceptionHandler(ClientNotEligibleException.class)
    public ResponseEntity<ApiError> handleClientNotEligibleException(ClientNotEligibleException exception , HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.CONFLICT).body(apiError) ;
    }

    @ExceptionHandler(AnnualIncomeException.class)
    public ResponseEntity<ApiError> handleAnnualIncomeException(AnnualIncomeException exception , HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.CONFLICT).body(apiError) ;
    }
}
