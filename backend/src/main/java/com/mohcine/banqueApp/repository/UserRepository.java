package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * @author USER
 **/

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // The entity's persistent field is `email` (getUsername()/setUsername()
    // only exist as UserDetails method overrides delegating to it) — a
    // derived findByUsername(...) can't resolve to any real JPA attribute.
    User findByEmail(String email);
}

