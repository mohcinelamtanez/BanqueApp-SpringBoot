package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.PaymentResponseDTO;
import com.mohcine.banqueApp.entity.Payment;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.exception.ClientNotFoundException;
import com.mohcine.banqueApp.mapper.PaymentMapper;
import com.mohcine.banqueApp.service.interfaces.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author USER
 **/
@Tag(name = "this endpoint allows to manage a loan's payment schedule")
@RestController
@RequestMapping("api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentMapper paymentMapper;

    public PaymentController(PaymentService paymentService, PaymentMapper paymentMapper) {
        this.paymentService = paymentService;
        this.paymentMapper = paymentMapper;
    }

    @Operation(summary = "this method returns the payment schedule for a loan")
    @GetMapping("loan/{loanId}")
    public List<PaymentResponseDTO> getPaymentsByLoan(@PathVariable Integer loanId) {
        return paymentService.getPaymentsByLoanId(loanId).stream()
                .map(paymentMapper::toDTO)
                .toList();
    }

    // "My Payments" — always the authenticated client's own payments,
    // never a client-supplied reference, so a client can never read
    // another client's repayment schedule.
    @Operation(summary = "this method returns the authenticated client's own payments")
    @GetMapping("/me")
    public List<PaymentResponseDTO> getMyPayments(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        if (user.getClient() == null) {
            throw new ClientNotFoundException("(current user is not linked to a client)");
        }
        return paymentService.getPaymentsByClientReference(user.getClient().getClientReference()).stream()
                .map(paymentMapper::toDTO)
                .toList();
    }

    @Operation(summary = "this method marks a payment as paid (Admin/BankAgent confirming an in-branch payment)")
    @PutMapping("/{id}/mark-paid")
    public PaymentResponseDTO markAsPaid(@PathVariable Integer id) {
        return paymentMapper.toDTO(paymentService.markAsPaid(id));
    }

    @Operation(summary = "this method reverts a payment marked as paid by mistake")
    @PutMapping("/{id}/mark-unpaid")
    public PaymentResponseDTO markAsUnpaid(@PathVariable Integer id) {
        return paymentMapper.toDTO(paymentService.markAsUnpaid(id));
    }
}
