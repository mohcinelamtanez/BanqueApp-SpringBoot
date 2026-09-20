package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

/**
 * @author USER
 **/

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // The entity's persistent field is `email` (getUsername()/setUsername()
    // only exist as UserDetails method overrides delegating to it) — a
    // derived findByUsername(...) can't resolve to any real JPA attribute.
    User findByEmail(String email);

    // The login account linked to a Client (User.client is unique), if any —
    // a Client created by an Admin may have no login account at all.
    User findByClient_Id(Integer clientId);

    // Enabled accounts holding at least one of the given authorities (e.g.
    // ROLE_ADMIN / ROLE_BANK_AGENT) — the recipients of back-office
    // notifications.
    List<User> findDistinctByEnabledTrueAndAuthorities_AuthorityIn(Collection<String> authorities);
}

