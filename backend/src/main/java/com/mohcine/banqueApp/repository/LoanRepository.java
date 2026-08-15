package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author USER
 **/
public interface LoanRepository extends JpaRepository<Loan,Integer> {

    List<Loan> getLoansByClientId(Integer clientId);



    List<Loan> findByClient_Id(Integer clientId);
}
