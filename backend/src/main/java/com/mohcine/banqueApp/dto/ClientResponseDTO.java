package com.mohcine.banqueApp.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.mohcine.banqueApp.enums.ClientStatus;

import java.math.BigDecimal;

/**
 * @author USER
 **/

@JsonPropertyOrder({
        "clientReference",
        "firstName",
        "lastName",
        "city",
        "postalCode",
        "annualIncome",
        "ClientStatus"
})

public record ClientResponseDTO(String ClientReference ,
                                String firstName ,
                                String lastName,
                                String city,
                                String postalCode,
                                BigDecimal annualIncome,
                                String email,
                                ClientStatus status
                                ) {

}
