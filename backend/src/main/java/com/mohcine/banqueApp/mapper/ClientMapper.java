package com.mohcine.banqueApp.mapper;

import com.mohcine.banqueApp.dto.ClientCreateDTO;
import com.mohcine.banqueApp.dto.ClientResponseDTO;
import com.mohcine.banqueApp.dto.ClientUpdateDTO;
import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.enums.ClientStatus;
import org.springframework.stereotype.Component;

/**
 * @author USER
 **/
@Component
public class ClientMapper {

    public Client toEntity(ClientCreateDTO dto) {
       Client client = new Client();

        client.setFirstName(dto.getFirstName()) ;
        client.setLastName(dto.getLastName()) ;
        client.setCity(dto.getCity()) ;
        client.setAnnualIncome(dto.getAnnualIncome());
        client.setPostalCode(dto.getPostalCode());
        client.setEmail(dto.getEmail());
        return client ;
    }

    public ClientResponseDTO  toDTO(Client client) {
        ClientResponseDTO clientResponseDTO = new ClientResponseDTO();

        clientResponseDTO.setClientReference(client.getClientReference());
        clientResponseDTO.setFirstName(client.getFirstName());
        clientResponseDTO.setLastName(client.getLastName());
        clientResponseDTO.setCity(client.getCity());
        clientResponseDTO.setPostalCode(client.getPostalCode());
        clientResponseDTO.setAnnualIncome(client.getAnnualIncome());
        clientResponseDTO.setEmail(client.getEmail());
        clientResponseDTO.setClientStatus(client.getClientStatus());

        return clientResponseDTO;
    }

    public Client updateEntity(String  reference, ClientUpdateDTO dto) {

        Client client = new Client();

        client.setClientReference(reference);
        client.setFirstName(dto.getFirstName());
        client.setLastName(dto.getLastName());
        client.setCity(dto.getCity());
        client.setPostalCode(dto.getPostalCode());
        client.setStatus(dto.getClientStatus());
        client.setAnnualIncome(dto.getAnnualIncome());

        return client;
    }



}
