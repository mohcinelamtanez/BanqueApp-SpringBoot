package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * @author USER
 **/
public interface ClientRepository extends JpaRepository<Client,Integer> {
    List<Client> findByLastNameContaining(String critere);

    // Serializes concurrent operations that must re-check a per-client
    // invariant (e.g. "no ACTIVE Loan") before acting — see
    // ApplicationServiceImpl.decide(). Native query: Hibernate's JPQL
    // @Lock(PESSIMISTIC_WRITE) emits "for update of <alias>", a syntax
    // MariaDB rejects — plain native "for update" works correctly.
    @Query(value = "select * from client where id = :id for update", nativeQuery = true)
    Optional<Client> findByIdForUpdate(@Param("id") Integer id);
}
