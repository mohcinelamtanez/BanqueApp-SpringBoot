package com.mohcine.banqueApp.repository;

import com.mohcine.banqueApp.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author USER
 **/
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByAuthority(String authority);
}
