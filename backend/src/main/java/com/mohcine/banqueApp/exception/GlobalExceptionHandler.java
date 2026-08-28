package com.mohcine.banqueApp.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

}
