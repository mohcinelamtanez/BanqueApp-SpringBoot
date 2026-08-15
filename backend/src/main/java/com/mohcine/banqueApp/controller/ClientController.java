package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.ClientCreateDTO;
import com.mohcine.banqueApp.dto.ClientResponseDTO;
import com.mohcine.banqueApp.dto.ClientUpdateDTO;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.mapper.ClientMapper;
import com.mohcine.banqueApp.service.impl.ClientServiceImpl;
import com.mohcine.banqueApp.service.interfaces.ClientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author USER
 **/
@RestController
@RequestMapping("api/v1/clients")
public class ClientController {

    private final ClientService clientService;
    private final ClientMapper clientMapper;

    ClientController(ClientService clientService, ClientMapper clientMapper) {
         this.clientService = clientService;
         this.clientMapper = clientMapper;
    }


     @GetMapping("/{id}")
     public ClientResponseDTO getClient(@PathVariable Integer id) {
       Client client = clientService.getClientById(id);

       return clientMapper.toDTO(client);

     }

    @GetMapping
    public List<ClientResponseDTO> getAllClients() {

        List<Client> clients = clientService.getAllClients();

        return clients.stream()
                .map(clientMapper::toDTO)
                .toList();
    }


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

    @PutMapping("/{id}")
    public ClientResponseDTO updateClient(
            @PathVariable Integer id,
            @RequestBody ClientUpdateDTO dto
    ) {
        Client client = clientMapper.updateEntity(id, dto);

        Client updatedClient = clientService.updateClient(client);

        return clientMapper.toDTO(updatedClient);
    }
}
