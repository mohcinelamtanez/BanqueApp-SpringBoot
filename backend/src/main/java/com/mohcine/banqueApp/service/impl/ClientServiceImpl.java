package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.repository.ClientRepository;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.service.interfaces.ClientService;
import com.mohcine.banqueApp.service.interfaces.LoanService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author USER
 **/
@Service
@Transactional
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository ;

    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public Client getClientById(Integer id) {
        return clientRepository.findById(id)
                .orElseThrow();
    }

    private LoanRepository loanRepository ;
    public LoanRepository getLoanRepository() {
        return loanRepository;
    }

    @Override
    public Client addClient(Client client) {
        return clientRepository.save(client) ;
    }

   /* @Override
    public void deleteClient(Integer id) {
        // delete all client loans
        List<Loan> clientLoans = loanRepository.getLoansByClientId(id);
        for (Loan loan : clientLoans) {
            loanService.deleteLoan(loan.getId());
        }

        // delete the client
         clientRepository.deleteById(id);
    } */


    @Override
    public Client updateClient(Client client) {
      return clientRepository.save(client);
    }


    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public List<Client> rechercherClients(String critere) {
        return clientRepository.findByLastNameContaining(critere);
    }

    @Override
    public BigDecimal calculerTotalPretsClient(Integer clientId) {
        List<Loan> loans = loanRepository.getLoansByClientId(clientId);

        BigDecimal total = BigDecimal.ZERO;

        for (Loan loan : loans) {
            total = total.add(loan.getLoanAmount());
        }

        return total;
    }



}

