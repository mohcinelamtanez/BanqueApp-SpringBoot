package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.RiskAssessment;
import com.mohcine.banqueApp.exception.ClientNotFoundException;
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
        Loan loan = loanMapper.toEntity(dto);
        loan.setClient(client);

        Loan savedLoan = loanRepository.save(loan);

        RiskAssessment risk = riskAssessmentMapper.toEntity(dto);
        risk.setLoan(savedLoan);
        riskAssessmentRepository.save(risk);

        paymentService.createPayments(savedLoan);

        return savedLoan;
        }
    }



    @Override
    public void deleteLoan(Integer loanId) {
        loanRepository.deleteById(loanId);
    }



    @Override
    public Loan updateLoan(Loan loan) {
        return loanRepository.save(loan);
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
    public Loan getLoanById(Integer loanId) {
        return loanRepository.findById(loanId).orElse(null);
    }
}
