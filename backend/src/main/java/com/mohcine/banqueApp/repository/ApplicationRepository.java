package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.Application;
import com.mohcine.banqueApp.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * @author USER
 **/
public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    List<Application> findByClient_ClientReference(String clientReference);

    // Backs LoanApplication eligibility ("no PENDING Application") without
    // loading the client's whole application history into memory.
    boolean existsByClient_ClientReferenceAndStatus(String clientReference, ApplicationStatus status);

    // Locks the row for the duration of the decision transaction so two
    // concurrent decide() calls on the same Application can't both read it
    // as PENDING and each create a Loan — see ApplicationServiceImpl.decide().
    // Native query: Hibernate's JPQL @Lock(PESSIMISTIC_WRITE) emits "for
    // update of <alias>", a syntax MariaDB rejects — plain native "for
    // update" works correctly.
    @Query(value = "select * from applications where id = :id for update", nativeQuery = true)
    Optional<Application> findByIdForUpdate(@Param("id") Integer id);
}
