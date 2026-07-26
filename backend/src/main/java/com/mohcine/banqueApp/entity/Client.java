package com.mohcine.banqueApp.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "nom", nullable = false, length = 100)
    private String firstName;

    @Column(name = "prenom", nullable =false, length = 100)
    private String lastName;

    @Column(name = "ville", nullable = false, length = 100)
    private String city;

    @Column(name = "cd_postal", nullable = false, length = 20)
    private String postalCode;

    @Column(name = "revenue", nullable = false, precision = 12, scale = 2)
    private BigDecimal annualIncome;

    public Client() {
    }

    public Client(String firstName, String lastName, String city,
                  String postalCode, BigDecimal annualIncome) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.city = city;
        this.postalCode = postalCode;
        this.annualIncome = annualIncome;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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
}