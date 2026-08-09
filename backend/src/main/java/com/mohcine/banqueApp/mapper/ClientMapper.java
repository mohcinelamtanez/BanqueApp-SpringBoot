package com.mohcine.banqueApp.mapper;

import com.mohcine.banqueApp.dto.ClientCreateDTO;
import com.mohcine.banqueApp.entity.Client;

/**
 * @author USER
 **/
public class ClientMapper {

    public Client toEntity(ClientCreateDTO dto) {
       Client client = new Client();

        client.setFirstName(dto.getFirstName()) ;
        client.setLastName(dto.getLastName()) ;
        client.setCity(dto.getCity()) ;
        client.setAnnualIncome(dto.getAnnualIncome());

        return client ;
    }
}
