package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.dto.LoanUpdateDTO;
import com.mohcine.banqueApp.dto.RiskInputDTO;
import com.mohcine.banqueApp.dto.RiskPredictionResponseDTO;
import com.mohcine.banqueApp.enums.RiskLevel;
import com.mohcine.banqueApp.exception.InvalidRiskInputException;
import org.mockito.ArgumentCaptor;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.RiskAssessment;
import com.mohcine.banqueApp.enums.LoanStatus;
import com.mohcine.banqueApp.mapper.LoanMapper;
import com.mohcine.banqueApp.mapper.RiskAssessmentMapper;
import com.mohcine.banqueApp.repository.ClientRepository;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.repository.RiskAssessmentRepository;
import com.mohcine.banqueApp.service.interfaces.PaymentService;
import com.mohcine.banqueApp.service.interfaces.RiskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Covers Loan creation/update behavior under the ACTIVE/COMPLETED/REJECTED
 * status model: End Date derivation and the terminal-status guard.
 */
@ExtendWith(MockitoExtension.class)
class LoanServiceImplTest {

    @Mock
    private LoanRepository loanRepository;
    @Mock
    private ClientRepository clientRepository;
    @Mock
    private LoanMapper loanMapper;
    @Mock
    private RiskAssessmentMapper riskAssessmentMapper;
    @Mock
    private RiskAssessmentRepository riskAssessmentRepository;
    @Mock
    private PaymentService paymentService;
    @Mock
    private RiskService riskService;

    private LoanServiceImpl loanService;

    @BeforeEach
    void setUp() {
        loanService = new LoanServiceImpl(loanRepository, clientRepository, loanMapper,
                riskAssessmentMapper, riskAssessmentRepository, paymentService, riskService);
    }

    private Client aClient() {
        Client client = new Client();
        client.setId(1);
        return client;
    }

    // Scenario 4: a Rejected Loan must have no End Date and must not
    // receive a payment schedule.
    @Test
    void createLoan_rejectedLoan_hasNoEndDateAndNoPaymentSchedule() {
        Client client = aClient();
        LoanCreateDto dto = new LoanCreateDto();
        dto.setClient(1);

        Loan loan = new Loan();
        loan.setStatus(LoanStatus.REJECTED);
        loan.setDuration(12);
        loan.setApprovalDate(LocalDateTime.now());

        when(clientRepository.findById(1)).thenReturn(Optional.of(client));
        when(loanRepository.findByClient_Id(1)).thenReturn(List.of());
        when(loanMapper.toEntity(dto)).thenReturn(loan);
        when(loanRepository.save(loan)).thenReturn(loan);
        when(riskAssessmentMapper.toEntity(dto)).thenReturn(new RiskAssessment());

        Loan result = loanService.createLoan(dto);

        assertThat(result.getStatus()).isEqualTo(LoanStatus.REJECTED);
        assertThat(result.getEndDate()).isNull();
        verify(paymentService, never()).generateScheduleIfMissing(any());
    }

    // An Active loan's End Date must be derived from startDate + duration,
    // and its payment schedule must be generated.
    @Test
    void createLoan_activeLoan_derivesEndDateAndGeneratesSchedule() {
        Client client = aClient();
        LoanCreateDto dto = new LoanCreateDto();
        dto.setClient(1);

        LocalDateTime approval = LocalDateTime.of(2026, 1, 1, 0, 0);
        Loan loan = new Loan();
        loan.setStatus(LoanStatus.ACTIVE);
        loan.setDuration(12);
        loan.setApprovalDate(approval);

        when(clientRepository.findById(1)).thenReturn(Optional.of(client));
        when(loanRepository.findByClient_Id(1)).thenReturn(List.of());
        when(loanMapper.toEntity(dto)).thenReturn(loan);
        when(loanRepository.save(loan)).thenReturn(loan);
        when(riskAssessmentMapper.toEntity(dto)).thenReturn(new RiskAssessment());

        Loan result = loanService.createLoan(dto);

        assertThat(result.getEndDate()).isEqualTo(approval.plusMonths(12));
        verify(paymentService).generateScheduleIfMissing(loan);
    }

    // Scenario 4/5 (state-transition guard): a terminal Loan (Rejected or
    // Completed) must not have its status overwritten by an unrelated
    // update, even if the request body includes a different status.
    @Test
    void updateLoan_ignoresStatusChange_whenLoanAlreadyRejected() {
        Loan loan = new Loan();
        loan.setId(5);
        loan.setStatus(LoanStatus.REJECTED);
        loan.setDuration(12);
        loan.setApprovalDate(LocalDateTime.now());

        LoanUpdateDTO dto = new LoanUpdateDTO();
        dto.setStatus(LoanStatus.ACTIVE);

        when(loanRepository.findById(5)).thenReturn(Optional.of(loan));
        when(loanRepository.save(loan)).thenReturn(loan);

        loanService.updateLoan(5, dto);

        assertThat(dto.getStatus()).isNull();
        assertThat(loan.getStatus()).isEqualTo(LoanStatus.REJECTED);
        verify(paymentService, never()).generateScheduleIfMissing(any());
    }

    @Test
    void updateLoan_ignoresStatusChange_whenLoanAlreadyCompleted() {
        Loan loan = new Loan();
        loan.setId(6);
        loan.setStatus(LoanStatus.COMPLETED);
        loan.setDuration(12);
        loan.setApprovalDate(LocalDateTime.now());

        LoanUpdateDTO dto = new LoanUpdateDTO();
        dto.setStatus(LoanStatus.ACTIVE);

        when(loanRepository.findById(6)).thenReturn(Optional.of(loan));
        when(loanRepository.save(loan)).thenReturn(loan);

        loanService.updateLoan(6, dto);

        assertThat(loan.getStatus()).isEqualTo(LoanStatus.COMPLETED);
        verify(paymentService, never()).generateScheduleIfMissing(any());
    }

    // A risky client stays risky: whatever level/score the request carries,
    // an Active loan is scored server-side from the client's real income.
    @Test
    void createLoan_activeLoan_overridesClientSuppliedRiskWithServerSideAssessment() {
        Client client = aClient();
        client.setAnnualIncome(new BigDecimal("24000"));
        LoanCreateDto dto = new LoanCreateDto();
        dto.setClient(1);
        dto.setStatus(LoanStatus.ACTIVE);
        dto.setMonthlyPayment(new BigDecimal("1800"));
        dto.setDuration(24);
        dto.setAnnualInterestRate(new BigDecimal("3.5"));
        dto.setRiskLevel(RiskLevel.LOW);            // what a caller claimed
        dto.setScore(new BigDecimal("0.01"));

        RiskPredictionResponseDTO prediction = new RiskPredictionResponseDTO();
        prediction.setDecision("RISQUE_ELEVE");
        prediction.setScoreRisk(new BigDecimal("0.91"));
        prediction.setRiskLevel(RiskLevel.HIGH);

        Loan loan = new Loan();
        loan.setStatus(LoanStatus.ACTIVE);
        loan.setDuration(24);
        loan.setApprovalDate(LocalDateTime.now());

        when(clientRepository.findById(1)).thenReturn(Optional.of(client));
        when(loanRepository.findByClient_Id(1)).thenReturn(List.of());
        when(riskService.assessRisk(any())).thenReturn(prediction);
        when(loanMapper.toEntity(dto)).thenReturn(loan);
        when(loanRepository.save(loan)).thenReturn(loan);
        when(riskAssessmentMapper.toEntity(dto)).thenReturn(new RiskAssessment());

        loanService.createLoan(dto);

        ArgumentCaptor<RiskInputDTO> input = ArgumentCaptor.forClass(RiskInputDTO.class);
        verify(riskService).assessRisk(input.capture());
        assertThat(input.getValue().getMonthlyIncome()).isEqualByComparingTo("2000.00"); // 24000 / 12
        assertThat(input.getValue().getMonthlyPayment()).isEqualByComparingTo("1800");
        assertThat(input.getValue().getDuration()).isEqualTo(24);
        assertThat(input.getValue().getAnnualInterestRate()).isEqualByComparingTo("3.5");

        assertThat(dto.getRiskLevel()).isEqualTo(RiskLevel.HIGH);
        assertThat(dto.getScore()).isEqualByComparingTo("0.91");
    }

    @Test
    void createLoan_activeLoan_refusedWhenClientHasNoIncome() {
        Client client = aClient();
        LoanCreateDto dto = new LoanCreateDto();
        dto.setClient(1);
        dto.setStatus(LoanStatus.ACTIVE);

        when(clientRepository.findById(1)).thenReturn(Optional.of(client));
        when(loanRepository.findByClient_Id(1)).thenReturn(List.of());

        assertThatThrownBy(() -> loanService.createLoan(dto))
                .isInstanceOf(InvalidRiskInputException.class);
        verify(loanRepository, never()).save(any());
    }
}
