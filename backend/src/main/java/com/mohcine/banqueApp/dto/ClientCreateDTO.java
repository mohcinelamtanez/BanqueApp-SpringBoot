package com.mohcine.banqueApp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mohcine.banqueApp.enums.ClientStatus;

import java.math.BigDecimal;

/**
 * @author USER
 **/
public class ClientCreateDTO {


    private String firstName;
    private String lastName;
    private String city;
    private String postalCode;

    private BigDecimal annualIncome;
    private String email ;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public BigDecimal getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(BigDecimal annualIncome) {
        this.annualIncome = annualIncome;
    }

    public String getEmail() {
        return email ;
    }

    public void setEmail(String email) {
        this.email = email ;
    }


}
