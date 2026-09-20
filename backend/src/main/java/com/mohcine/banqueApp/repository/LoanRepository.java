package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author USER
 **/
public interface LoanRepository extends JpaRepository<Loan,Integer> {

    List<Loan> getLoansByClientId(Integer clientId);



    List<Loan> findByClient_Id(Integer clientId);

    // Backs LoanApplication eligibility ("no ACTIVE Loan") without loading
    // the client's whole loan history into memory.
    boolean existsByClient_IdAndStatus(Integer clientId, LoanStatus status);
}
