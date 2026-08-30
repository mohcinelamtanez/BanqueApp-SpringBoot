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

        client.setFirstName(dto.firstName()) ;
        client.setLastName(dto.lastName()) ;
        client.setCity(dto.city()) ;
        client.setAnnualIncome(dto.annualIncome());
        client.setPostalCode(dto.postalCode());
        client.setEmail(dto.email());
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
