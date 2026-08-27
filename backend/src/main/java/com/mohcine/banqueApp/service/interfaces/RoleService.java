package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.entity.Role;

import java.util.Collection;

/**
 * @author USER
 **/
public interface RoleService {
    Role save(Role role);

    void save(Collection<Role> roles);

    Role findByAuthority(String authority);
}
