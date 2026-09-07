package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.dto.LoanUpdateDTO;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
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

    private LoanServiceImpl loanService;

    @BeforeEach
    void setUp() {
        loanService = new LoanServiceImpl(loanRepository, clientRepository, loanMapper,
                riskAssessmentMapper, riskAssessmentRepository, paymentService);
    }

    private Client aClient() {
        Client client = new Client();
        client.setClientReference("CLI-1");
        return client;
    }

    // Scenario 4: a Rejected Loan must have no End Date and must not
    // receive a payment schedule.
    @Test
    void createLoan_rejectedLoan_hasNoEndDateAndNoPaymentSchedule() {
        Client client = aClient();
        LoanCreateDto dto = new LoanCreateDto();
        dto.setClientReference("CLI-1");

        Loan loan = new Loan();
        loan.setStatus(LoanStatus.REJECTED);
        loan.setDuration(12);
        loan.setApprovalDate(LocalDateTime.now());

        when(clientRepository.findByClientReference("CLI-1")).thenReturn(client);
        when(loanRepository.findByClient_ClientReference("CLI-1")).thenReturn(List.of());
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
        dto.setClientReference("CLI-1");

        LocalDateTime approval = LocalDateTime.of(2026, 1, 1, 0, 0);
        Loan loan = new Loan();
        loan.setStatus(LoanStatus.ACTIVE);
        loan.setDuration(12);
        loan.setApprovalDate(approval);

        when(clientRepository.findByClientReference("CLI-1")).thenReturn(client);
        when(loanRepository.findByClient_ClientReference("CLI-1")).thenReturn(List.of());
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
}
