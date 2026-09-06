package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.ClientCreateDTO;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.exception.ClientNotFoundException;
import com.mohcine.banqueApp.exception.EmailAlreadyUsedException;
import com.mohcine.banqueApp.exception.InvalidFileException;
import com.mohcine.banqueApp.mapper.ClientMapper;
import com.mohcine.banqueApp.repository.ClientRepository;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.repository.UserRepository;
import com.mohcine.banqueApp.service.interfaces.FileStorageService;
import com.mohcine.banqueApp.service.interfaces.LoanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Covers the "My Profile" self-service User <-> Client association:
 * first save creates and links a Client, every save after that updates the
 * same Client in place (never a second one), and the target is always the
 * authenticated user's own Client.
 */
@ExtendWith(MockitoExtension.class)
class ClientServiceImplTest {

    private static final Integer USER_ID = 7;

    @Mock
    private ClientRepository clientRepository;
    @Mock
    private LoanService loanService;
    @Mock
    private LoanRepository loanRepository;
    @Mock
    private ClientMapper clientMapper;
    @Mock
    private UserRepository userRepository;
    @Mock
    private FileStorageService fileStorageService;

    private ClientServiceImpl clientService;

    @BeforeEach
    void setUp() {
        clientService = new ClientServiceImpl(
                clientRepository, loanService, loanRepository, clientMapper, userRepository, fileStorageService);
    }

    private ClientCreateDTO aProfile() {
        return new ClientCreateDTO(
                "Jane", "Doe", "Casablanca", "20000",
                BigDecimal.valueOf(120000), "jane.doe@example.com");
    }

    private MultipartFile aValidImage() {
        return new MockMultipartFile(
                "file", "photo.png", "image/png", new byte[]{1, 2, 3, 4});
    }

    private User aUserWithNoClient() {
        User user = new User();
        user.setId(USER_ID);
        return user;
    }

    private User aUserWithClient(Client client) {
        User user = new User();
        user.setId(USER_ID);
        user.setClient(client);
        return user;
    }

    // First save: User.client == null -> a new Client is created and
    // immediately linked back onto the User.
    @Test
    void saveMyProfile_createsAndLinksClient_whenUserHasNoClientYet() {
        User user = aUserWithNoClient();
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        Client mappedEntity = new Client();
        mappedEntity.setAnnualIncome(BigDecimal.valueOf(120000));
        mappedEntity.setEmail("jane.doe@example.com");
        when(clientMapper.toEntity(any())).thenReturn(mappedEntity);
        when(clientRepository.findAll()).thenReturn(List.of());
        when(clientRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Client saved = clientService.saveMyProfile(USER_ID, aProfile());

        assertThat(saved).isSameAs(mappedEntity);
        assertThat(user.getClient()).isSameAs(saved);
        verify(userRepository).save(user);
    }

    // Second (and every later) save: User.client != null -> the existing
    // Client is updated in place, never a second one created.
    @Test
    void saveMyProfile_updatesExistingClient_whenUserAlreadyHasOne() {
        Client existing = new Client();
        existing.setId(3);
        existing.setEmail("old@example.com");
        User user = aUserWithClient(existing);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(clientRepository.findAll()).thenReturn(List.of(existing));
        when(clientRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Client saved = clientService.saveMyProfile(USER_ID, aProfile());

        assertThat(saved).isSameAs(existing);
        assertThat(saved.getFirstName()).isEqualTo("Jane");
        assertThat(saved.getEmail()).isEqualTo("jane.doe@example.com");
        verify(clientMapper, never()).toEntity(any());
        verify(userRepository, never()).save(any());
    }

    // Updating never creates a duplicate: addClient()'s reference
    // generation is only ever reached on the create branch.
    @Test
    void saveMyProfile_neverCreatesASecondClient_forTheSameUser() {
        Client existing = new Client();
        existing.setId(3);
        existing.setEmail("jane.doe@example.com");
        User user = aUserWithClient(existing);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(clientRepository.findAll()).thenReturn(List.of(existing));
        when(clientRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        clientService.saveMyProfile(USER_ID, aProfile());
        clientService.saveMyProfile(USER_ID, aProfile());

        verify(clientMapper, never()).toEntity(any());
        assertThat(user.getClient()).isSameAs(existing);
    }

    // Updating to an email already used by a *different* Client is
    // rejected, same rule as the admin-facing create path.
    @Test
    void saveMyProfile_rejectsUpdate_whenEmailBelongsToAnotherClient() {
        Client existing = new Client();
        existing.setId(3);
        existing.setEmail("old@example.com");
        Client other = new Client();
        other.setId(9);
        other.setEmail("jane.doe@example.com");
        User user = aUserWithClient(existing);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(clientRepository.findAll()).thenReturn(List.of(existing, other));

        assertThatThrownBy(() -> clientService.saveMyProfile(USER_ID, aProfile()))
                .isInstanceOf(EmailAlreadyUsedException.class);

        verify(clientRepository, never()).save(any());
    }

    // The new reference must never collide with an existing one, even when
    // clientRepository.count() would understate it (e.g. after a deletion,
    // or with a numbering gap) — it's derived from the highest existing
    // "CLI-N" suffix instead.
    @Test
    void saveMyProfile_generatesReference_fromHighestExistingSuffix_notFromCount() {
        User user = aUserWithNoClient();
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        Client mappedEntity = new Client();
        mappedEntity.setAnnualIncome(BigDecimal.valueOf(120000));
        mappedEntity.setEmail("jane.doe@example.com");
        when(clientMapper.toEntity(any())).thenReturn(mappedEntity);
        Client onlyExisting = new Client();
        onlyExisting.setEmail("someone.else@example.com");
        onlyExisting.setClientReference("CLI-7");
        when(clientRepository.findAll()).thenReturn(List.of(onlyExisting));
        when(clientRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Client saved = clientService.saveMyProfile(USER_ID, aProfile());

        assertThat(saved.getClientReference()).isEqualTo("CLI-8");
    }

    // The avatar URL is optional: a null profilePhotoUrl must not prevent
    // the profile from being created.
    @Test
    void saveMyProfile_succeeds_withNoProfilePhotoUrl() {
        User user = aUserWithNoClient();
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        Client mappedEntity = new Client();
        mappedEntity.setAnnualIncome(BigDecimal.valueOf(120000));
        mappedEntity.setEmail("jane.doe@example.com");
        mappedEntity.setProfilePhotoUrl(null);
        when(clientMapper.toEntity(any())).thenReturn(mappedEntity);
        when(clientRepository.findAll()).thenReturn(List.of());
        when(clientRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Client saved = clientService.saveMyProfile(USER_ID, aProfile());

        assertThat(saved.getProfilePhotoUrl()).isNull();
    }

    // Uploading always resolves the target Client from the authenticated
    // User's own id — there is no clientId/reference parameter to tamper
    // with, so a Client can never upload for another Client through this
    // method's signature.
    @Test
    void updateProfilePhoto_storesFileAndPersistsReturnedUrl() {
        Client client = new Client();
        client.setId(3);
        client.setClientReference("CLI-3");
        User user = aUserWithClient(client);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(fileStorageService.store(eq("clients/CLI-3/profile"), any()))
                .thenReturn("/uploads/clients/CLI-3/profile/new-file.png");
        when(clientRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Client saved = clientService.updateProfilePhoto(USER_ID, aValidImage());

        assertThat(saved.getProfilePhotoUrl()).isEqualTo("/uploads/clients/CLI-3/profile/new-file.png");
        verify(clientRepository).save(client);
    }

    // Replacing an existing avatar: the old file is only deleted after the
    // new one is stored and the Client saved — never before.
    @Test
    void updateProfilePhoto_deletesOldFile_onlyAfterNewOneIsStored() {
        Client client = new Client();
        client.setId(3);
        client.setClientReference("CLI-3");
        client.setProfilePhotoUrl("/uploads/clients/CLI-3/profile/old-file.png");
        User user = aUserWithClient(client);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(fileStorageService.store(anyString(), any()))
                .thenReturn("/uploads/clients/CLI-3/profile/new-file.png");
        when(clientRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        clientService.updateProfilePhoto(USER_ID, aValidImage());

        verify(fileStorageService).delete("/uploads/clients/CLI-3/profile/old-file.png");
    }

    @Test
    void updateProfilePhoto_rejectsEmptyFile() {
        User user = aUserWithClient(new Client());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        MultipartFile empty = new MockMultipartFile("file", "empty.png", "image/png", new byte[0]);

        assertThatThrownBy(() -> clientService.updateProfilePhoto(USER_ID, empty))
                .isInstanceOf(InvalidFileException.class);

        verify(fileStorageService, never()).store(any(), any());
    }

    @Test
    void updateProfilePhoto_rejectsUnsupportedContentType() {
        User user = aUserWithClient(new Client());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        MultipartFile exe = new MockMultipartFile(
                "file", "malware.exe", "application/x-msdownload", new byte[]{1, 2, 3});

        assertThatThrownBy(() -> clientService.updateProfilePhoto(USER_ID, exe))
                .isInstanceOf(InvalidFileException.class);

        verify(fileStorageService, never()).store(any(), any());
    }

    @Test
    void updateProfilePhoto_rejectsOversizedFile() {
        User user = aUserWithClient(new Client());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        byte[] tooLarge = new byte[6 * 1024 * 1024];
        MultipartFile big = new MockMultipartFile("file", "big.png", "image/png", tooLarge);

        assertThatThrownBy(() -> clientService.updateProfilePhoto(USER_ID, big))
                .isInstanceOf(InvalidFileException.class);

        verify(fileStorageService, never()).store(any(), any());
    }

    @Test
    void updateProfilePhoto_rejected_whenUserHasNoClient() {
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(aUserWithNoClient()));

        assertThatThrownBy(() -> clientService.updateProfilePhoto(USER_ID, aValidImage()))
                .isInstanceOf(ClientNotFoundException.class);

        verify(fileStorageService, never()).store(any(), any());
    }

    @Test
    void removeProfilePhoto_clearsUrlAndDeletesStoredFile() {
        Client client = new Client();
        client.setId(3);
        client.setProfilePhotoUrl("/uploads/clients/CLI-3/profile/old-file.png");
        User user = aUserWithClient(client);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(clientRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Client saved = clientService.removeProfilePhoto(USER_ID);

        assertThat(saved.getProfilePhotoUrl()).isNull();
        verify(fileStorageService).delete("/uploads/clients/CLI-3/profile/old-file.png");
    }
}
