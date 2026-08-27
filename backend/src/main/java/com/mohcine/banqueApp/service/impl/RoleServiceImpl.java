package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Role;
import com.mohcine.banqueApp.repository.RoleRepository;
import com.mohcine.banqueApp.service.interfaces.RoleService;
import org.springframework.stereotype.Service;

import java.util.Collection;

/**
 * @author USER
 **/
@Service
public class RoleServiceImpl implements RoleService {

        private RoleRepository roleRepository;

        public RoleServiceImpl(RoleRepository roleRepository) {
            this.roleRepository = roleRepository;
        }

        @Override
        public Role save(Role role) {
            Role loadedRole = roleRepository.findByAuthority(role.getAuthority());
            if(loadedRole == null){
                return roleRepository.save(role);
            }else{
                return loadedRole;
            }
        }

        @Override
        public void save(Collection<Role> roles) {
            if(roles!=null && !roles.isEmpty()){
                for (Role role :roles) {
                    Role foundedRole = findByAuthority(role.getAuthority());
                    if (foundedRole != null) {
                        role.setId(foundedRole.getId());
                    }else{
                        roleRepository.save(role);
                    }
                }
            }
        }

        @Override
        public Role findByAuthority(String authority) {
            return roleRepository.findByAuthority(authority);
        }
}
