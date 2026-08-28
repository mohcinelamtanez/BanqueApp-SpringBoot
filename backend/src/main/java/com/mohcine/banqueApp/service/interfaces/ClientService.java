package  com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.dto.ClientUpdateDTO;
import com.mohcine.banqueApp.entity.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ClientService {

    Client addClient(Client client);

    void deleteClient(Integer id);

    public Client updateClient(String reference , ClientUpdateDTO dto);

    Client getClientByRef(String clientReference);

    List<Client> getAllClients();

    List<Client> rechercherClients(String critere);

    BigDecimal calculerTotalPretsClient(Integer clientId);


}