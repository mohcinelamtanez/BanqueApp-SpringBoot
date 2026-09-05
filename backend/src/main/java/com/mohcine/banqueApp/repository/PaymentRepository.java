package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.Payment;
import com.mohcine.banqueApp.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author USER
 **/
public interface PaymentRepository extends JpaRepository<Payment,Integer> {
    List<Payment> findByLoan_Id(Integer loanId);

    // All payments across every Loan belonging to one client — backs "My
    // Payments" without the client ever fetching another client's data.
    List<Payment> findByLoan_Client_ClientReference(String clientReference);

    boolean existsByLoan_Id(Integer loanId);

    boolean existsByLoan_IdAndStatusNot(Integer loanId, PaymentStatus status);

    void deleteByLoan_Id(Integer loanId);
}
