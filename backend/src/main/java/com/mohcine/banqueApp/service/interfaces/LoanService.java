package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.entity.Loan;

import java.util.List;

/**
 * @author USER
 **/
public interface LoanService {

    List<Loan> getPretsByClientId(Integer clientId);
}
