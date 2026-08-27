package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.enums.ClientStatus;
import com.mohcine.banqueApp.repository.ClientRepository;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.service.interfaces.ClientService;
import com.mohcine.banqueApp.service.interfaces.LoanService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * @author USER
 **/
@Service
@Transactional
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository ;
    private final LoanService loanService ;
    private final LoanRepository loanRepository ;

    public ClientServiceImpl(ClientRepository clientRepository ,
                             LoanService loanService,
                            LoanRepository loanRepository) {
        this.clientRepository = clientRepository;
        this.loanService = loanService;
        this.loanRepository = loanRepository;
    }

    @Override
    public Client getClientByRef(String clientReference) {
        return clientRepository.findByClientReference(clientReference);
    }



    @Override
    public Client addClient(Client client) {
        long count = clientRepository.count();
        String reference = "CLI-" + (count + 1);
        client.setClientReference(reference);

        client.setStatus(ClientStatus.ACTIVE);

        return clientRepository.save(client) ;
    }

   @Override
    public void deleteClient(Integer id) {
        // delete all client loans
        List<Loan> clientLoans = loanRepository.findByClient_Id(id);
        for (Loan loan : clientLoans) {
            loanService.deleteLoan(loan.getId());
        }


        // delete the client
         clientRepository.deleteById(id);
    }


    @Override
    public Client updateClient(Client client) {
        Client clientToUpdate = clientRepository.findByClientReference(client.getClientReference());

        return clientRepository.save(clientToUpdate);
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

