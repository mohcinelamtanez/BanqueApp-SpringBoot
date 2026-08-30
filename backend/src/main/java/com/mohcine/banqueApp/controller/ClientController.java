package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.ClientCreateDTO;
import com.mohcine.banqueApp.dto.ClientResponseDTO;
import com.mohcine.banqueApp.dto.ClientUpdateDTO;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.mapper.ClientMapper;
import com.mohcine.banqueApp.service.interfaces.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

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
