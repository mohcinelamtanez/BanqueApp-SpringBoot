package  com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.entity.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

public interface ClientService {

    Client addClient(Client client);

    void deleteClient(Integer id);

    Client updateClient(Client client);

    Client getClientById(Integer id);

    List<Client> getAllClients();

    List<Client> rechercherClients(String critere);

    BigDecimal calculerTotalPretsClient(Integer clientId);


}