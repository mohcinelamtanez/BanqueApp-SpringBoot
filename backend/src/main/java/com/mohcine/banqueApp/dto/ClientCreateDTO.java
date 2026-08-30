package com.mohcine.banqueApp.dto;

import java.math.BigDecimal;

/**
 * @author USER
 **/
public record ClientCreateDTO(
        String firstName ,
        String lastName ,
        String city ,
        String  postalCode ,
        BigDecimal annualIncome ,
        String email
) {
}

