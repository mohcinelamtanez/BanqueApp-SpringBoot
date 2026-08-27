package com.mohcine.banqueApp.service.util;

/**
 * @author USER
 **/

public class StringUtil {
    public static boolean isNotEmpty(Object value) {
        return value!= null && !value.toString().isEmpty();
    }
}