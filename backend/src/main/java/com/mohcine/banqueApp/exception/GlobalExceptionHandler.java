package com.mohcine.banqueApp.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

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

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleUserAlreadyExistsException(UserAlreadyExistsException exception , HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.CONFLICT).body(apiError) ;
    }

    @ExceptionHandler(InvalidRegistrationException.class)
    public ResponseEntity<ApiError> handleInvalidRegistrationException(InvalidRegistrationException exception , HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError) ;
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

    @ExceptionHandler(InvalidFileException.class)
    public ResponseEntity<ApiError> handleInvalidFileException(InvalidFileException exception , HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                exception.getMessage(),
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError) ;
    }

    // Spring rejects an oversized multipart body before it ever reaches the
    // controller (see spring.servlet.multipart.max-file-size) — surfaced as
    // the same kind of 400 as any other invalid upload, not a raw 500.
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiError> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException exception , HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                "Image must be 5MB or smaller.",
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError) ;
    }

    @ExceptionHandler(StorageException.class)
    public ResponseEntity<ApiError> handleStorageException(StorageException exception , HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        ApiError apiError = new ApiError(LocalDateTime.now() ,
                status.value() ,
                status.name() ,
                "Could not process the uploaded file. Please try again.",
                request.getRequestURI());

        return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiError) ;
    }
}
