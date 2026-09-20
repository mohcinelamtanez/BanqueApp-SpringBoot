package com.mohcine.banqueApp.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.mohcine.banqueApp.enums.ClientStatus;

import java.math.BigDecimal;

/**
 * @author USER
 **/

@JsonPropertyOrder({
        "id",
        "firstName",
        "lastName",
        "city",
        "postalCode",
        "annualIncome",
        "ClientStatus"
})

public record ClientResponseDTO(Integer id ,
                                String firstName ,
                                String lastName,
                                String city,
                                String postalCode,
                                BigDecimal annualIncome,
                                String email,
                                ClientStatus status,
                                String profilePhotoUrl
                                ) {

}
