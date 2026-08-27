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
        "annualIncome" ,
        "status"
})
public class ClientResponseDTO {
    private String clientReference;
    private String firstName;
    private String lastName;
    private String city;
    private String postalCode;
    private BigDecimal annualIncome;
    private String email ;
    private ClientStatus status ;



    public String getClientReference(){
        return clientReference ;
    }

    public void setClientReference(String clientReference) {
        this.clientReference = clientReference ;
    }
    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }



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

    public BigDecimal getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(BigDecimal annualIncome) {
        this.annualIncome = annualIncome;
    }

    public String getEmail(){
        return email ;
    }

    public void setEmail(String email){
        this.email = email ;
    }

    public void setClientStatus(ClientStatus clientStatus) {
        this.status = clientStatus;
    }
}
