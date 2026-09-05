package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.ApplicationCreateDto;
import com.mohcine.banqueApp.dto.ApplicationDecisionDto;
import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.entity.Application;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.enums.ApplicationStatus;
import com.mohcine.banqueApp.enums.LoanStatus;
import com.mohcine.banqueApp.enums.RiskLevel;
import com.mohcine.banqueApp.exception.ApplicationAlreadyDecidedException;
import com.mohcine.banqueApp.exception.ApplicationNotFoundException;
import com.mohcine.banqueApp.exception.ClientNotEligibleException;
import com.mohcine.banqueApp.exception.ClientNotFoundException;
import com.mohcine.banqueApp.mapper.ApplicationMapper;
import com.mohcine.banqueApp.repository.ApplicationRepository;
import com.mohcine.banqueApp.repository.ClientRepository;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.service.interfaces.ApplicationService;
import com.mohcine.banqueApp.service.interfaces.LoanService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @author USER
 **/
@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ClientRepository clientRepository;
    private final ApplicationMapper applicationMapper;
    private final LoanService loanService;
    private final LoanRepository loanRepository;

    public ApplicationServiceImpl(
            ApplicationRepository applicationRepository,
            ClientRepository clientRepository,
            ApplicationMapper applicationMapper,
            LoanService loanService,
            LoanRepository loanRepository) {
        this.applicationRepository = applicationRepository;
        this.clientRepository = clientRepository;
        this.applicationMapper = applicationMapper;
        this.loanService = loanService;
        this.loanRepository = loanRepository;
    }

    @Override
    @Transactional
    public Application submitApplication(String clientReference, ApplicationCreateDto dto) {
        Client client = clientRepository.findByClientReference(clientReference);
        if (client == null) {
            throw new ClientNotFoundException(clientReference);
        }
        ensureClientIsEligible(clientReference);
        Application application = applicationMapper.toEntity(dto);
        application.setClient(client);
        return applicationRepository.save(application);
    }

    // Eligible = no ACTIVE Loan (an ongoing financial obligation) AND no
    // PENDING Application (already awaiting a decision). Completed and
    // Rejected Loans never block — they carry no ongoing obligation. An
    // Approved Application never blocks either: by the time it's Approved
    // it has already produced a Loan, and that Loan's own status (ACTIVE)
    // is what's relevant from here on — checking both would double-block
    // the same real-world condition.
    private void ensureClientIsEligible(String clientReference) {
        if (loanRepository.existsByClient_ClientReferenceAndStatus(clientReference, LoanStatus.ACTIVE)) {
            throw new ClientNotEligibleException("You already have an active loan.");
        }
        if (applicationRepository.existsByClient_ClientReferenceAndStatus(clientReference, ApplicationStatus.PENDING)) {
            throw new ClientNotEligibleException("You already have a pending loan application.");
        }
    }

    @Override
    public List<Application> getApplicationsByClientReference(String clientReference) {
        return applicationRepository.findByClient_ClientReference(clientReference);
    }

    @Override
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // Reuses the existing LoanService.createLoan() for the resulting Loan
    // record in both branches — the decision here never re-implements Loan
    // creation/schedule-generation logic, it only decides the Application
    // and hands the terms off to the Loan feature that already owns that.
    @Override
    @Transactional
    public Application decide(Integer applicationId, ApplicationDecisionDto dto) {
        // Locks this Application row for the transaction: if two decide()
        // calls race on the same application (double-click, retry), the
        // second blocks until the first commits, then correctly sees it's
        // no longer PENDING instead of also creating a Loan.
        Application application = applicationRepository.findByIdForUpdate(applicationId)
                .orElseThrow(() -> new ApplicationNotFoundException(applicationId));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new ApplicationAlreadyDecidedException(
                    "This application has already been decided.");
        }

        String clientReference = application.getClient().getClientReference();

        if (dto.getStatus() == ApplicationStatus.APPROVED) {
            // Re-check the one-ACTIVE-Loan invariant right before creating
            // one — the client may no longer be eligible even though they
            // were at submission time. Locking the Client row serializes
            // this against a concurrent approval of a *different* pending
            // application for the same client, so two approvals can't each
            // pass this check and both create an ACTIVE loan.
            clientRepository.findByClientReferenceForUpdate(clientReference);
            if (loanRepository.existsByClient_ClientReferenceAndStatus(clientReference, LoanStatus.ACTIVE)) {
                throw new ClientNotEligibleException("You already have an active loan.");
            }
        }

        application.setStatus(dto.getStatus());
        if (dto.getStatus() == ApplicationStatus.REJECTED) {
            application.setRejectionReason(dto.getRejectionReason());
        }
        Application savedApplication = applicationRepository.save(application);

        LoanCreateDto loanCreateDto = new LoanCreateDto();
        loanCreateDto.setClientReference(application.getClient().getClientReference());
        loanCreateDto.setLoanType(application.getLoanType());
        loanCreateDto.setLoanAmount(application.getRequestedAmount());
        loanCreateDto.setDuration(application.getRequestedDuration());
        loanCreateDto.setApprovalDate(LocalDateTime.now());

        // RiskAssessment.level is non-nullable for every Loan, approved or
        // not (the existing client self-service flow falls back to LOW the
        // same way when no real assessment is available — see
        // NewApplicationModal.jsx) — never leave it null here.
        loanCreateDto.setRiskLevel(dto.getRiskLevel() != null ? dto.getRiskLevel() : RiskLevel.LOW);
        loanCreateDto.setScore(dto.getScore());

        if (dto.getStatus() == ApplicationStatus.APPROVED) {
            loanCreateDto.setStatus(LoanStatus.ACTIVE);
            loanCreateDto.setAnnualInterestRate(dto.getAnnualInterestRate());
            loanCreateDto.setMonthlyPayment(dto.getMonthlyPayment());
        } else {
            // Retained for traceability only — a Rejected Loan never has a
            // repayment period, so the rate is never actually used.
            loanCreateDto.setStatus(LoanStatus.REJECTED);
            loanCreateDto.setAnnualInterestRate(
                    dto.getAnnualInterestRate() != null ? dto.getAnnualInterestRate() : BigDecimal.ZERO);
            loanCreateDto.setRejectionReason(dto.getRejectionReason());
        }

        loanService.createLoan(loanCreateDto);

        return savedApplication;
    }
}
