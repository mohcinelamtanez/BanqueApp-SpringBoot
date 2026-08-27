package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @author USER
 **/
public interface ClientRepository extends JpaRepository<Client,Integer> {
    List<Client> findByLastNameContaining(String critere);

}
