package  com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.dto.ClientCreateDTO;
import com.mohcine.banqueApp.dto.ClientUpdateDTO;
import com.mohcine.banqueApp.entity.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ClientService {

    Client addClient(Client client);

    // Self-service "My Profile" save: creates the Client and links it to
    // the given User the first time (User.client == null), or updates the
    // User's already-linked Client on every save after that. Never creates
    // a second Client for the same User.
    Client saveMyProfile(Integer userId, ClientCreateDTO dto);

    // Uploads/replaces the authenticated User's own Client's profile photo.
    // Validates the file, stores it centrally, updates and persists the
    // Client, and cleans up the previous file (if any) only after the new
    // one is safely stored.
    Client updateProfilePhoto(Integer userId, MultipartFile file);

    // Removes the authenticated User's own Client's profile photo, if any.
    Client removeProfilePhoto(Integer userId);

    void deleteClient(Integer id);

    void deleteClientByReference(String clientReference);

    public Client updateClient(String reference , ClientUpdateDTO dto);

    Client getClientByRef(String clientReference);

    List<Client> getAllClients();

    List<Client> rechercherClients(String critere);

    BigDecimal calculerTotalPretsClient(Integer clientId);


}