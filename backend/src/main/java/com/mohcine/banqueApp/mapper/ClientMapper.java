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
        return
                new ClientResponseDTO(
                client.getClientReference(),
                client.getFirstName(),
                client.getLastName(),
                client.getCity(),
                client.getPostalCode(),
                client.getAnnualIncome(),
                client.getEmail(),
                client.getClientStatus()
        );
    }

    public void updateEntity( ClientUpdateDTO dto , Client client) {

        client.setFirstName(dto.getFirstName());
        client.setLastName(dto.getLastName());
        client.setCity(dto.getCity());
        client.setPostalCode(dto.getPostalCode());
        client.setAnnualIncome(dto.getAnnualIncome());
        client.setEmail(dto.getEmail());

    }

}
