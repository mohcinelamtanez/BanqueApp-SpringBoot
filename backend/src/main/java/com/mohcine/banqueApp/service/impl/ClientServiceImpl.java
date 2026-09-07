package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.ClientCreateDTO;
import com.mohcine.banqueApp.dto.ClientUpdateDTO;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.enums.ClientStatus;
import com.mohcine.banqueApp.exception.AnnualIncomeException;
import com.mohcine.banqueApp.exception.ClientNotFoundException;
import com.mohcine.banqueApp.exception.EmailAlreadyUsedException;
import com.mohcine.banqueApp.exception.InvalidFileException;
import com.mohcine.banqueApp.mapper.ClientMapper;
import com.mohcine.banqueApp.repository.ClientRepository;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.repository.UserRepository;
import com.mohcine.banqueApp.service.interfaces.ClientService;
import com.mohcine.banqueApp.service.interfaces.FileStorageService;
import com.mohcine.banqueApp.service.interfaces.LoanService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * @author USER
 **/
@Service
@Transactional
public class ClientServiceImpl implements ClientService {

    private static final long MAX_PHOTO_SIZE_BYTES = 5L * 1024 * 1024;
    private static final Set<String> ALLOWED_PHOTO_CONTENT_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp");

    private final ClientRepository clientRepository ;
    private final LoanService loanService ;
    private final LoanRepository loanRepository ;
    private final ClientMapper clientMapper ;
    private final UserRepository userRepository ;
    private final FileStorageService fileStorageService ;

    public ClientServiceImpl(ClientRepository clientRepository ,
                             LoanService loanService,
                            LoanRepository loanRepository ,
                             ClientMapper clientMapper,
                             UserRepository userRepository,
                             FileStorageService fileStorageService) {
        this.clientRepository = clientRepository;
        this.loanService = loanService;
        this.loanRepository = loanRepository;
        this.clientMapper = clientMapper ;
        this.userRepository = userRepository ;
        this.fileStorageService = fileStorageService ;
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
        List<Client> existingClients = clientRepository.findAll();
        for(Client c : existingClients) {
            if (c.getEmail().equals(client.getEmail())) {
                throw new EmailAlreadyUsedException();
            };
        }
        if(client.getAnnualIncome().intValue() < 0) {
             throw new AnnualIncomeException() ;
        }
            client.setClientReference(nextClientReference(existingClients));

            client.setStatus(ClientStatus.ACTIVE);

            return clientRepository.save(client);
    }

    // "CLI-" + count() collided as soon as any client was ever deleted, or
    // any gap existed in the sequence (self-registration now creates a
    // Client far more routinely than the old admin-only path ever did,
    // which is what surfaced this) — derive the next reference from the
    // highest existing numeric suffix instead, so it's always free.
    private String nextClientReference(List<Client> existingClients) {
        int max = 0;
        for (Client c : existingClients) {
            String ref = c.getClientReference();
            if (ref == null || !ref.startsWith("CLI-")) continue;
            try {
                max = Math.max(max, Integer.parseInt(ref.substring("CLI-".length())));
            } catch (NumberFormatException ignored) {
                // non-numeric suffix — ignore, doesn't affect the sequence
            }
        }
        return "CLI-" + (max + 1);
    }

    // The authenticated User's own linked Client is the only thing this
    // ever touches — never a client-supplied id/reference. First save
    // (User.client == null) reuses addClient() as-is (reference
    // generation, duplicate-email check, income validation, ACTIVE
    // status), then links the new Client back onto the User. Every save
    // after that updates the same Client in place, so a User can never end
    // up with more than one associated Client.
    @Override
    public Client saveMyProfile(Integer userId, ClientCreateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ClientNotFoundException("(user not found)"));

        if (user.getClient() != null) {
            Client client = user.getClient();
            validateAnnualIncome(dto.annualIncome());
            ensureEmailNotUsedByAnotherClient(dto.email(), client.getId());
            client.setFirstName(dto.firstName());
            client.setLastName(dto.lastName());
            client.setCity(dto.city());
            client.setPostalCode(dto.postalCode());
            client.setAnnualIncome(dto.annualIncome());
            client.setEmail(dto.email());
            return clientRepository.save(client);
        }

        Client saved = addClient(clientMapper.toEntity(dto));
        user.setClient(saved);
        userRepository.save(user);
        return saved;
    }

    // Same ownership rule as saveMyProfile: the target Client is always the
    // authenticated User's own linked one, never a client-supplied id. The
    // previous photo (if any) is only deleted after the new one is stored
    // and the Client saved — never before, so a failed upload can't leave
    // the profile without a photo.
    @Override
    public Client updateProfilePhoto(Integer userId, MultipartFile file) {
        Client client = clientOfUser(userId);
        validatePhoto(file);

        String previousUrl = client.getProfilePhotoUrl();
        String newUrl = fileStorageService.store(
                "clients/" + client.getClientReference() + "/profile", file);
        client.setProfilePhotoUrl(newUrl);
        Client saved = clientRepository.save(client);

        if (previousUrl != null && !previousUrl.equals(newUrl)) {
            fileStorageService.delete(previousUrl);
        }
        return saved;
    }

    @Override
    public Client removeProfilePhoto(Integer userId) {
        Client client = clientOfUser(userId);
        String previousUrl = client.getProfilePhotoUrl();
        client.setProfilePhotoUrl(null);
        Client saved = clientRepository.save(client);
        if (previousUrl != null) {
            fileStorageService.delete(previousUrl);
        }
        return saved;
    }

    private Client clientOfUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ClientNotFoundException("(user not found)"));
        Client client = user.getClient();
        if (client == null) {
            throw new ClientNotFoundException("(current user is not linked to a client)");
        }
        return client;
    }

    private void validatePhoto(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Select an image to upload.");
        }
        if (file.getSize() > MAX_PHOTO_SIZE_BYTES) {
            throw new InvalidFileException("Image must be 5MB or smaller.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_PHOTO_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new InvalidFileException("Only JPEG, PNG or WEBP images are supported.");
        }
    }

    private void validateAnnualIncome(BigDecimal annualIncome) {
        if (annualIncome == null || annualIncome.intValue() < 0) {
            throw new AnnualIncomeException();
        }
    }

    private void ensureEmailNotUsedByAnotherClient(String email, Integer clientId) {
        for (Client c : clientRepository.findAll()) {
            if (c.getEmail().equals(email) && !c.getId().equals(clientId)) {
                throw new EmailAlreadyUsedException();
            }
        }
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
    public void deleteClientByReference(String clientReference) {
        Client client = clientRepository.findByClientReference(clientReference);
        if (client == null) {
            throw new ClientNotFoundException(clientReference);
        }
        deleteClient(client.getId());
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

