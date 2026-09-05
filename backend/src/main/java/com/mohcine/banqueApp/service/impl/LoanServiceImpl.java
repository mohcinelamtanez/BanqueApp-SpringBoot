package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.dto.LoanUpdateDTO;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.RiskAssessment;
import com.mohcine.banqueApp.enums.LoanStatus;
import com.mohcine.banqueApp.exception.ActiveLoanExistsException;
import com.mohcine.banqueApp.exception.ClientNotFoundException;
import com.mohcine.banqueApp.exception.LoanNotFoundException;
import com.mohcine.banqueApp.mapper.LoanMapper;
import com.mohcine.banqueApp.mapper.RiskAssessmentMapper;
import com.mohcine.banqueApp.repository.ClientRepository;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.repository.RiskAssessmentRepository;
import com.mohcine.banqueApp.service.interfaces.LoanService;
import com.mohcine.banqueApp.service.interfaces.PaymentService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author USER
 **/
@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final ClientRepository clientRepository ;
    private final LoanMapper loanMapper ;
    private final RiskAssessmentMapper riskAssessmentMapper ;
    private final RiskAssessmentRepository riskAssessmentRepository ;
    private final PaymentService paymentService ;

    public LoanServiceImpl(LoanRepository loanRepository ,
                           ClientRepository clientRepository ,
                           LoanMapper loanMapper,
                           RiskAssessmentMapper riskAssessmentMapper,
                           RiskAssessmentRepository riskAssessmentRepository,
                           PaymentService paymentService
    ) {

        this.loanRepository = loanRepository;
        this.clientRepository = clientRepository;
        this.loanMapper = loanMapper ;
        this.riskAssessmentMapper = riskAssessmentMapper ;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.paymentService = paymentService ;

    }

   @Override
    @Transactional
    public Loan createLoan(LoanCreateDto dto) {

        Client client = clientRepository.findByClientReference(dto.getClientReference());

        if(client == null) {
            throw new ClientNotFoundException(dto.getClientReference());
        }else
        {
        // A Rejected loan is a traceability record, not a new repayment
        // obligation — it never competes for the client's one-active-loan
        // slot, so the guard only applies when the loan being created will
        // actually be Active.
        if (dto.getStatus() != LoanStatus.REJECTED) {
            ensureClientCanApply(client);
        }

        Loan loan = loanMapper.toEntity(dto);
        loan.setClient(client);
        applyDerivedEndDate(loan);

        Loan savedLoan = loanRepository.save(loan);

        RiskAssessment risk = riskAssessmentMapper.toEntity(dto);
        risk.setLoan(savedLoan);
        riskAssessmentRepository.save(risk);

        // The repayment schedule only starts once the loan is actually
        // Active — a Rejected loan must not generate any payments. (A
        // request still awaiting a decision is a LoanApplication concern,
        // not represented by a Loan row at all.)
        if (savedLoan.getStatus() == LoanStatus.ACTIVE) {
            paymentService.generateScheduleIfMissing(savedLoan);
        }

        return savedLoan;
        }
    }

    // A client may only have one Active loan with unpaid installments at a
    // time — no new Loan while a previous one is still being repaid.
    // (Blocking a duplicate application while one is still under review is
    // a LoanApplication-level concern, handled separately.)
    private void ensureClientCanApply(Client client) {
        List<Loan> existingLoans = loanRepository.findByClient_ClientReference(client.getClientReference());
        for (Loan existing : existingLoans) {
            if (existing.getStatus() == LoanStatus.ACTIVE
                    && paymentService.hasUnpaidInstallments(existing.getId())) {
                throw new ActiveLoanExistsException(
                        "You must finish repaying your current active loan before applying for a new one.");
            }
        }
    }

    // endDate is never client-supplied — it is fully derived from the
    // Loan's own approvalDate ("startDate", the Admin/Bank Agent's decision
    // date) plus its duration. A Rejected loan has no repayment period, so
    // it must never carry one, regardless of what a request body sent.
    private void applyDerivedEndDate(Loan loan) {
        if (loan.getStatus() == LoanStatus.ACTIVE || loan.getStatus() == LoanStatus.COMPLETED) {
            loan.setEndDate(loan.getApprovalDate().plusMonths(loan.getDuration()));
        } else {
            loan.setEndDate(null);
        }
    }



    @Override
    @Transactional
    public void deleteLoan(Integer loanId) {
        // Both Payment.loan and RiskAssessment.loan are non-nullable FKs —
        // deleting the loan first always failed with a constraint violation
        // once either existed (i.e. for every loan, since createLoan always
        // creates a RiskAssessment).
        paymentService.deleteAllForLoan(loanId);
        RiskAssessment risk = riskAssessmentRepository.findByLoan_Id(loanId);
        if (risk != null) {
            riskAssessmentRepository.delete(risk);
        }
        loanRepository.deleteById(loanId);
    }



    @Override
    @Transactional
    public Loan updateLoan(Integer id, LoanUpdateDTO dto) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException(id));

        // This generic update endpoint must never be the one to change a
        // Loan's status: Rejected is permanently terminal, and Completed
        // only ever moves (in either direction) through the payment flow
        // in PaymentServiceImpl — forward when the last installment is
        // paid, back to Active if a payment is later reverted to unpaid.
        // An unrelated edit that happens to resend the loan's own current
        // status is not a transition and is left untouched.
        boolean isTerminal = loan.getStatus() == LoanStatus.COMPLETED
                || loan.getStatus() == LoanStatus.REJECTED;
        if (isTerminal && dto.getStatus() != null && dto.getStatus() != loan.getStatus()) {
            dto.setStatus(null);
        }

        loanMapper.updateEntity(dto, loan);
        applyDerivedEndDate(loan);

        Loan savedLoan = loanRepository.save(loan);

        // generateScheduleIfMissing() is idempotent, so this is also safe
        // to hit on an unrelated edit of an already-active loan.
        if (savedLoan.getStatus() == LoanStatus.ACTIVE) {
            paymentService.generateScheduleIfMissing(savedLoan);
        }

        return savedLoan;
    }

    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public List<Loan> getLoansByClientId(Integer clientId) {
        return loanRepository.findByClient_Id(clientId);
    }

    @Override
    public List<Loan> getLoansByClientReference(String clientReference) {
        return loanRepository.findByClient_ClientReference(clientReference);
    }

    @Override
    public Loan getLoanById(Integer loanId) {
        return loanRepository.findById(loanId).orElse(null);
    }
}
