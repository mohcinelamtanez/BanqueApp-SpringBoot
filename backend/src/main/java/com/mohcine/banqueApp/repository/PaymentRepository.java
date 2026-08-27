package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author USER
 **/
public interface PaymentRepository extends JpaRepository<Payment,Integer> {
}
