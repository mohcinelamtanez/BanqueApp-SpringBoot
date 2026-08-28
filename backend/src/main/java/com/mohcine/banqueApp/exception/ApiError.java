package com.mohcine.banqueApp.exception;

import java.time.LocalDateTime;

/**
 * @author USER
 **/
public record ApiError(LocalDateTime timestamp , int status , String errorMessage , String message , String path) {} ;

