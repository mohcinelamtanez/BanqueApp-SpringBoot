package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.ApplicationCreateDto;
import com.mohcine.banqueApp.dto.ApplicationDecisionDto;
import com.mohcine.banqueApp.entity.Application;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.enums.ApplicationStatus;
import com.mohcine.banqueApp.enums.LoanStatus;
import com.mohcine.banqueApp.enums.LoanType;
import com.mohcine.banqueApp.enums.RiskLevel;
import com.mohcine.banqueApp.exception.ApplicationAlreadyDecidedException;
import com.mohcine.banqueApp.exception.ApplicationNotFoundException;
import com.mohcine.banqueApp.exception.ClientNotEligibleException;
import com.mohcine.banqueApp.mapper.ApplicationMapper;
import com.mohcine.banqueApp.repository.ApplicationRepository;
import com.mohcine.banqueApp.repository.ClientRepository;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.service.interfaces.LoanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Covers the client eligibility rule for submitting a new LoanApplication:
 * no ACTIVE Loan and no PENDING Application.
 */
@ExtendWith(MockitoExtension.class)
class ApplicationServiceImplTest {

    private static final String CLIENT_REFERENCE = "CLI-1";

    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private ClientRepository clientRepository;
    @Mock
    private ApplicationMapper applicationMapper;
    @Mock
    private LoanService loanService;
    @Mock
    private LoanRepository loanRepository;

    private ApplicationServiceImpl applicationService;

    @BeforeEach
    void setUp() {
        applicationService = new ApplicationServiceImpl(
                applicationRepository, clientRepository, applicationMapper, loanService, loanRepository);
    }

    // A complete profile (all required Client fields filled in) — these
    // fixtures exist to test the ACTIVE-loan/PENDING-application
    // eligibility rule, not profile completeness (see the dedicated
    // ensureProfileComplete tests below), so the client must never be the
    // reason submitApplication rejects here.
    private Client aClient() {
        Client client = new Client();
        client.setClientReference(CLIENT_REFERENCE);
        client.setFirstName("Jane");
        client.setLastName("Doe");
        client.setCity("Casablanca");
        client.setPostalCode("20000");
        client.setAnnualIncome(BigDecimal.valueOf(120000));
        client.setEmail("jane.doe@example.com");
        return client;
    }

    private ApplicationCreateDto aRequest() {
        ApplicationCreateDto dto = new ApplicationCreateDto();
        dto.setLoanType(LoanType.CONSO);
        dto.setRequestedAmount(BigDecimal.valueOf(50000));
        dto.setRequestedDuration(24);
        return dto;
    }

    private void stubNoActiveLoan() {
        when(loanRepository.existsByClient_ClientReferenceAndStatus(CLIENT_REFERENCE, LoanStatus.ACTIVE))
                .thenReturn(false);
    }

    private void stubActiveLoan() {
        when(loanRepository.existsByClient_ClientReferenceAndStatus(CLIENT_REFERENCE, LoanStatus.ACTIVE))
                .thenReturn(true);
    }

    private void stubNoPendingApplication() {
        lenient()
                .when(applicationRepository.existsByClient_ClientReferenceAndStatus(CLIENT_REFERENCE, ApplicationStatus.PENDING))
                .thenReturn(false);
    }

    private void stubPendingApplication() {
        when(applicationRepository.existsByClient_ClientReferenceAndStatus(CLIENT_REFERENCE, ApplicationStatus.PENDING))
                .thenReturn(true);
    }

    // COMPLETED Loan only (no ACTIVE, no PENDING) -> allowed. A Completed
    // Loan is invisible to the eligibility check entirely — only ACTIVE is
    // ever queried.
    @Test
    void submitApplication_succeeds_whenClientHasOnlyCompletedLoan() {
        when(clientRepository.findByClientReference(CLIENT_REFERENCE)).thenReturn(aClient());
        stubNoActiveLoan();
        stubNoPendingApplication();
        when(applicationMapper.toEntity(any())).thenReturn(new Application());
        when(applicationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        applicationService.submitApplication(CLIENT_REFERENCE, aRequest());

        verify(applicationRepository).save(any());
    }

    // REJECTED Loan only -> allowed, same reasoning as Completed.
    @Test
    void submitApplication_succeeds_whenClientHasOnlyRejectedLoan() {
        when(clientRepository.findByClientReference(CLIENT_REFERENCE)).thenReturn(aClient());
        stubNoActiveLoan();
        stubNoPendingApplication();
        when(applicationMapper.toEntity(any())).thenReturn(new Application());
        when(applicationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        applicationService.submitApplication(CLIENT_REFERENCE, aRequest());

        verify(applicationRepository).save(any());
    }

    // Case F: Completed + Rejected Loans, no Pending Application -> allowed.
    @Test
    void submitApplication_succeeds_withCompletedAndRejectedLoans_andNoPendingApplication() {
        when(clientRepository.findByClientReference(CLIENT_REFERENCE)).thenReturn(aClient());
        stubNoActiveLoan();
        stubNoPendingApplication();
        when(applicationMapper.toEntity(any())).thenReturn(new Application());
        when(applicationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        applicationService.submitApplication(CLIENT_REFERENCE, aRequest());

        verify(applicationRepository).save(any());
    }

    // Rule 1 / Case C: an ACTIVE Loan alone blocks a new application.
    @Test
    void submitApplication_rejected_whenClientHasActiveLoan() {
        when(clientRepository.findByClientReference(CLIENT_REFERENCE)).thenReturn(aClient());
        stubActiveLoan();

        assertThatThrownBy(() -> applicationService.submitApplication(CLIENT_REFERENCE, aRequest()))
                .isInstanceOf(ClientNotEligibleException.class)
                .hasMessageContaining("active loan");

        verify(applicationRepository, never()).save(any());
    }

    // Rule 4: a PENDING Application alone blocks a new application.
    @Test
    void submitApplication_rejected_whenClientHasPendingApplication() {
        when(clientRepository.findByClientReference(CLIENT_REFERENCE)).thenReturn(aClient());
        stubNoActiveLoan();
        stubPendingApplication();

        assertThatThrownBy(() -> applicationService.submitApplication(CLIENT_REFERENCE, aRequest()))
                .isInstanceOf(ClientNotEligibleException.class)
                .hasMessageContaining("pending");

        verify(applicationRepository, never()).save(any());
    }

    // Case E: ACTIVE Loan + PENDING Application together -> still rejected
    // (the Active Loan check alone is enough to block).
    @Test
    void submitApplication_rejected_whenClientHasActiveLoanAndPendingApplication() {
        when(clientRepository.findByClientReference(CLIENT_REFERENCE)).thenReturn(aClient());
        stubActiveLoan();

        assertThatThrownBy(() -> applicationService.submitApplication(CLIENT_REFERENCE, aRequest()))
                .isInstanceOf(ClientNotEligibleException.class);

        verify(applicationRepository, never()).save(any());
    }

    // An incomplete Client profile blocks a new application, independently
    // of the ACTIVE-loan/PENDING-application rule (checked first, so
    // neither loanRepository nor applicationRepository is ever consulted).
    @Test
    void submitApplication_rejected_whenClientProfileIsIncomplete() {
        Client incomplete = aClient();
        incomplete.setCity(null);
        when(clientRepository.findByClientReference(CLIENT_REFERENCE)).thenReturn(incomplete);

        assertThatThrownBy(() -> applicationService.submitApplication(CLIENT_REFERENCE, aRequest()))
                .isInstanceOf(ClientNotEligibleException.class)
                .hasMessageContaining("profile");

        verify(applicationRepository, never()).save(any());
    }

    // A blank (non-null but empty) required field is treated the same as a
    // missing one.
    @Test
    void submitApplication_rejected_whenClientProfileFieldIsBlank() {
        Client incomplete = aClient();
        incomplete.setEmail("   ");
        when(clientRepository.findByClientReference(CLIENT_REFERENCE)).thenReturn(incomplete);

        assertThatThrownBy(() -> applicationService.submitApplication(CLIENT_REFERENCE, aRequest()))
                .isInstanceOf(ClientNotEligibleException.class)
                .hasMessageContaining("profile");

        verify(applicationRepository, never()).save(any());
    }

    // A complete profile plus a passing eligibility check succeeds — the
    // two rules are independent and both must pass.
    @Test
    void submitApplication_succeeds_whenProfileCompleteAndEligible() {
        when(clientRepository.findByClientReference(CLIENT_REFERENCE)).thenReturn(aClient());
        stubNoActiveLoan();
        stubNoPendingApplication();
        when(applicationMapper.toEntity(any())).thenReturn(new Application());
        when(applicationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        applicationService.submitApplication(CLIENT_REFERENCE, aRequest());

        verify(applicationRepository).save(any());
    }

    // Ownership: the eligibility check is always scoped to the
    // authenticated client's own reference — another client's records can
    // never be consulted or affect the outcome.
    @Test
    void submitApplication_checksEligibility_onlyForTheGivenClientReference() {
        when(clientRepository.findByClientReference(CLIENT_REFERENCE)).thenReturn(aClient());
        stubNoActiveLoan();
        stubNoPendingApplication();
        when(applicationMapper.toEntity(any())).thenReturn(new Application());
        when(applicationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        applicationService.submitApplication(CLIENT_REFERENCE, aRequest());

        verify(loanRepository).existsByClient_ClientReferenceAndStatus(eq(CLIENT_REFERENCE), eq(LoanStatus.ACTIVE));
        verify(applicationRepository).existsByClient_ClientReferenceAndStatus(eq(CLIENT_REFERENCE), eq(ApplicationStatus.PENDING));
    }

    private Application aPendingApplication(int id) {
        Application application = new Application();
        application.setId(id);
        application.setClient(aClient());
        application.setLoanType(LoanType.CONSO);
        application.setRequestedAmount(BigDecimal.valueOf(50000));
        application.setRequestedDuration(24);
        application.setStatus(ApplicationStatus.PENDING);
        return application;
    }

    private ApplicationDecisionDto anApprovalDecision() {
        ApplicationDecisionDto dto = new ApplicationDecisionDto();
        dto.setStatus(ApplicationStatus.APPROVED);
        dto.setAnnualInterestRate(BigDecimal.valueOf(5.5));
        dto.setMonthlyPayment(BigDecimal.valueOf(2200));
        dto.setRiskLevel(RiskLevel.LOW);
        dto.setScore(BigDecimal.valueOf(0.1));
        return dto;
    }

    private ApplicationDecisionDto aRejectionDecision() {
        ApplicationDecisionDto dto = new ApplicationDecisionDto();
        dto.setStatus(ApplicationStatus.REJECTED);
        dto.setRejectionReason("Insufficient income");
        return dto;
    }

    // Approval: PENDING -> APPROVED creates exactly one Loan when the
    // client currently has no ACTIVE Loan.
    @Test
    void decide_approves_andCreatesLoan_whenClientHasNoActiveLoan() {
        Application application = aPendingApplication(10);
        when(applicationRepository.findByIdForUpdate(10)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(clientRepository.findByClientReferenceForUpdate(CLIENT_REFERENCE))
                .thenReturn(Optional.of(aClient()));
        stubNoActiveLoan();

        Application result = applicationService.decide(10, anApprovalDecision());

        assertThat(result.getStatus()).isEqualTo(ApplicationStatus.APPROVED);
        verify(loanService).createLoan(any());
    }

    // Section 10: the ACTIVE-Loan invariant is re-checked at approval time,
    // not just at submission — approving must not create a second ACTIVE
    // Loan for a client that already has one.
    @Test
    void decide_rejectsApproval_whenClientAlreadyHasActiveLoanAtApprovalTime() {
        Application application = aPendingApplication(11);
        when(applicationRepository.findByIdForUpdate(11)).thenReturn(Optional.of(application));
        when(clientRepository.findByClientReferenceForUpdate(CLIENT_REFERENCE))
                .thenReturn(Optional.of(aClient()));
        stubActiveLoan();

        assertThatThrownBy(() -> applicationService.decide(11, anApprovalDecision()))
                .isInstanceOf(ClientNotEligibleException.class)
                .hasMessageContaining("active loan");

        verify(loanService, never()).createLoan(any());
        verify(applicationRepository, never()).save(any());
    }

    // Rejection never needs the ACTIVE-Loan re-check (it never creates one)
    // and always succeeds regardless of the client's Loan state.
    @Test
    void decide_rejectsApplication_createsRejectedLoan_withoutActiveLoanCheck() {
        Application application = aPendingApplication(12);
        when(applicationRepository.findByIdForUpdate(12)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Application result = applicationService.decide(12, aRejectionDecision());

        assertThat(result.getStatus()).isEqualTo(ApplicationStatus.REJECTED);
        verify(loanService).createLoan(any());
        verify(loanRepository, never()).existsByClient_ClientReferenceAndStatus(any(), eq(LoanStatus.ACTIVE));
    }

    // Section 11/12: a second decide() call on an already-decided
    // Application (double-click, retry) must never create a second Loan.
    @Test
    void decide_throws_whenApplicationAlreadyDecided() {
        Application application = aPendingApplication(13);
        application.setStatus(ApplicationStatus.APPROVED);
        when(applicationRepository.findByIdForUpdate(13)).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.decide(13, anApprovalDecision()))
                .isInstanceOf(ApplicationAlreadyDecidedException.class);

        verify(loanService, never()).createLoan(any());
    }

    @Test
    void decide_throws_whenApplicationNotFound() {
        when(applicationRepository.findByIdForUpdate(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applicationService.decide(999, anApprovalDecision()))
                .isInstanceOf(ApplicationNotFoundException.class);
    }
}
