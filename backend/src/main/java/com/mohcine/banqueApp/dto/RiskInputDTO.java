package com.mohcine.banqueApp.dto;

import java.math.BigDecimal;

/**
 * @author USER
 **/
public class RiskInputDTO {
   // Monthly income — the risk model (see ml-model/app.py) was trained on
   // a "revenu" column whose scale (mean ~3231, range 1200-6807) matches a
   // monthly salary, not Client.annualIncome divided by 12; sending the
   // annual figure as-is skewed every prediction by roughly a factor of 12.
   private  BigDecimal monthlyIncome ;
   private  BigDecimal monthlyPayment ;
   private  Integer duration;
   private  BigDecimal annualInterestRate ;

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome){
        this.monthlyIncome = monthlyIncome ;
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
