package com.mohcine.banqueApp.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Nom", nullable = false, length = 100)
    private String firstName;

    @Column(name = "Prenom", nullable =false, length = 100)
    private String lastName;

    @Column(name = "Ville", nullable = false, length = 100)
    private String city;

    @Column(name = "Cd_postal", nullable = false, length = 20)
    private String postalCode;

    @Column(name = "Revenue", nullable = false, precision = 12, scale = 2)
    private BigDecimal annualIncome;

    @OneToMany(mappedBy = "client")
    private List<Loan> loans ;


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

    public List<Loan> getLoans() {
        return loans ;
    }

    public void setLoans(List<Loan> loans) {
        this.loans = loans ;
    }
    public void setAnnualIncome(BigDecimal annualIncome) {
        this.annualIncome = annualIncome;
    }
}