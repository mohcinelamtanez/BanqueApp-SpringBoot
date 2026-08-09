package com.mohcine.banqueApp.mapper;

import com.mohcine.banqueApp.dto.ClientCreateDTO;
import com.mohcine.banqueApp.dto.ClientResponseDTO;
import com.mohcine.banqueApp.dto.ClientUpdateDTO;
import com.mohcine.banqueApp.entity.Client;
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

        return client ;
    }

    public ClientResponseDTO  toDTO(Client client) {
        ClientResponseDTO clientResponseDTO = new ClientResponseDTO();

        clientResponseDTO.setId(client.getId());
        clientResponseDTO.setFirstName(client.getFirstName());
        clientResponseDTO.setLastName(client.getLastName());
        clientResponseDTO.setCity(client.getCity());
        clientResponseDTO.setPostalCode(client.getPostalCode());
        clientResponseDTO.setAnnualIncome(client.getAnnualIncome());

        return clientResponseDTO;
    }

    public Client updateEntity(Integer id, ClientUpdateDTO dto) {

        Client client = new Client();

        client.setId(id);
        client.setFirstName(dto.getFirstName());
        client.setLastName(dto.getLastName());
        client.setCity(dto.getCity());
        client.setPostalCode(dto.getPostalCode());
        client.setAnnualIncome(dto.getAnnualIncome());

        return client;
    }



}
