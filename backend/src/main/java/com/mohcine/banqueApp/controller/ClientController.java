package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.ClientCreateDTO;
import com.mohcine.banqueApp.dto.ClientResponseDTO;
import com.mohcine.banqueApp.dto.ClientUpdateDTO;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.mapper.ClientMapper;
import com.mohcine.banqueApp.service.interfaces.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author USER
 **/
@Tag(name = "this endpoint allows to manage client")
@RestController
@RestControllerAdvice
@RequestMapping("api/v1/clients")
public class ClientController {

    private final ClientService clientService;
    private final ClientMapper clientMapper;

    ClientController(ClientService clientService, ClientMapper clientMapper) {
         this.clientService = clientService;
         this.clientMapper = clientMapper;
    }


    // "My Profile" — the Client linked to the authenticated User, never a
    // client-supplied id/reference. No Client yet (User.client == null)
    // returns 204 so the frontend can tell "not created yet" apart from a
    // real error, instead of throwing ClientNotFoundException.
    @Operation(summary = "returns the authenticated user's own client profile, if any")
    @GetMapping("/me")
    public ResponseEntity<ClientResponseDTO> getMyProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        if (user.getClient() == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(clientMapper.toDTO(user.getClient()));
    }

    // Creates the Client and links it to the authenticated User the first
    // time this is called, or updates the already-linked Client on every
    // call after that — see ClientServiceImpl.saveMyProfile(). The target
    // Client is always resolved from the authenticated identity, so a
    // client can never edit another Client's profile through this endpoint.
    @Operation(summary = "creates or updates the authenticated user's own client profile")
    @PutMapping("/me")
    public ClientResponseDTO saveMyProfile(
            @RequestBody ClientCreateDTO dto,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Client saved = clientService.saveMyProfile(user.getId(), dto);
        return clientMapper.toDTO(saved);
    }

    // Uploads/replaces the authenticated user's own client's profile photo.
    // The file is validated and stored centrally (see
    // ClientServiceImpl.updateProfilePhoto / FileStorageService) — never an
    // arbitrary client-supplied URL, and never another client's profile.
    @Operation(summary = "uploads or replaces the authenticated user's own profile photo")
    @PostMapping(value = "/me/profile-photo", consumes = "multipart/form-data")
    public ClientResponseDTO uploadMyProfilePhoto(
            // required = false: a genuinely missing part must reach
            // ClientServiceImpl.validatePhoto()'s null check and come back
            // as a clean InvalidFileException (400) — Spring's own
            // MissingServletRequestPartException, left to its default
            // handling, surfaces as this app's usual unhandled-exception
            // 403 instead of a meaningful error.
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Client saved = clientService.updateProfilePhoto(user.getId(), file);
        return clientMapper.toDTO(saved);
    }

    @Operation(summary = "removes the authenticated user's own profile photo, if any")
    @DeleteMapping("/me/profile-photo")
    public ClientResponseDTO removeMyProfilePhoto(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Client saved = clientService.removeProfilePhoto(user.getId());
        return clientMapper.toDTO(saved);
    }

    @Operation(summary = "this method returns the client based on the reference")
     @GetMapping("reference/{reference}")
     public ClientResponseDTO getClient(@PathVariable String reference) {
      Client client  =  clientService.getClientByRef(reference);
      return clientMapper.toDTO(client);
     }

     @Operation(summary = "this method return all the client present in the database")
    @GetMapping
    public List<ClientResponseDTO> getAllClients() {

        List<Client> clients = clientService.getAllClients();

        return clients.stream()
                .map(clientMapper::toDTO)
                .toList();
    }


    @Operation(summary = "this method create a new Client")
     @PostMapping
     public ClientResponseDTO createClient(@RequestBody ClientCreateDTO clientCreateDTO) {
        Client client = clientMapper.toEntity(clientCreateDTO);
        Client savedClient = clientService.addClient(client)  ;
        return clientMapper.toDTO(savedClient);
      }

     @DeleteMapping("/{id}")
     public void deleteClient(@PathVariable Integer id) {
        clientService.deleteClient(id);
     }

    @Operation(summary = "this method deletes a client based on the reference")
    @DeleteMapping("reference/{reference}")
    public void deleteClientByReference(@PathVariable String reference) {
        clientService.deleteClientByReference(reference);
    }

    @PutMapping("reference/{reference}")
    public ClientResponseDTO updateClient(
            @PathVariable String  reference,
            @RequestBody ClientUpdateDTO dto
    ) {
        return   clientMapper.
                  toDTO(clientService.
                          updateClient(reference , dto)) ;
    }
}
