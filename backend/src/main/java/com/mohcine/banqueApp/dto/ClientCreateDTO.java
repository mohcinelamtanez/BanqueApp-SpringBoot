package com.mohcine.banqueApp.dto;

import java.math.BigDecimal;

/**
 * @author USER
 **/
// profilePhotoUrl is intentionally not part of this DTO — the profile photo
// is managed exclusively through the dedicated upload/remove endpoints
// (ClientController.uploadMyProfilePhoto / removeMyProfilePhoto), backed by
// real server-side storage, never accepted as an arbitrary client-supplied
// URL string.
public record ClientCreateDTO(
        String firstName ,
        String lastName ,
        String city ,
        String  postalCode ,
        BigDecimal annualIncome ,
        String email
) {
}

