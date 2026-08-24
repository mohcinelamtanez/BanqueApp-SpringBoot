package com.mohcine.banqueApp.dto;

import java.math.BigDecimal;

/**
 * @author USER
 **/
public class RiskInputDTO {
   private  BigDecimal annualIncome ;
   private  BigDecimal monthlyPayment ;
   private  Integer duration;
   private  BigDecimal annualInterestRate ;

    public BigDecimal getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(BigDecimal annualIncome){
        this.annualIncome = annualIncome ;
    }

    public BigDecimal getMonthlyPayment() {
        return monthlyPayment;
    }

    public void setMonthlyPayment(BigDecimal monthlyPayment){
        this.monthlyPayment = monthlyPayment ;
    }

    public Integer getDuration(){
        return duration ;
    }

    public void setDuration(Integer duration) {
        this.duration = duration ;
    }

    public BigDecimal getAnnualInterestRate(){
        return annualInterestRate ;
    }

    public void setAnnualInterestRate(BigDecimal annualInterestRate){
        this.annualInterestRate = annualInterestRate ;
    }
}
