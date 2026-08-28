package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.ClientUpdateDTO;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.enums.ClientStatus;
import com.mohcine.banqueApp.exception.ClientNotFoundException;
import com.mohcine.banqueApp.mapper.ClientMapper;
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
    private final ClientMapper clientMapper ;

    public ClientServiceImpl(ClientRepository clientRepository ,
                             LoanService loanService,
                            LoanRepository loanRepository ,
                             ClientMapper clientMapper) {
        this.clientRepository = clientRepository;
        this.loanService = loanService;
        this.loanRepository = loanRepository;
        this.clientMapper = clientMapper ;
    }

    @Override
    public Client getClientByRef(String clientReference) {

        Client client = clientRepository.findByClientReference(clientReference) ;
        if(client == null ) {
            throw new ClientNotFoundException(clientReference) ;
        }
            return client ;
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
    public Client updateClient(String reference ,  ClientUpdateDTO dto) {


        Client client = clientRepository.findByClientReference(reference);
        clientMapper.updateEntity(dto , client);

       return clientRepository.save(client) ;


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

