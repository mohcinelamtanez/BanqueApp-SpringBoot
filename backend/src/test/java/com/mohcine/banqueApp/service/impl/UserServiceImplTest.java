package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Role;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.exception.InvalidRoleException;
import com.mohcine.banqueApp.exception.UserNotFoundException;
import com.mohcine.banqueApp.repository.UserRepository;
import com.mohcine.banqueApp.service.interfaces.RoleService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Covers the admin-only role-assignment feature: a user can only ever be
 * (re)assigned ROLE_BANK_AGENT or ROLE_CLIENT this way — never ROLE_ADMIN,
 * which stays out of self-service admin user management entirely.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    private static final Integer USER_ID = 5;

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleService roleService;

    @InjectMocks
    private UserServiceImpl userService;

    private User aUser() {
        User user = new User();
        user.setId(USER_ID);
        user.setUsername("agent@example.com");
        return user;
    }

    @Test
    void assignRole_setsBankAgentRole() {
        User user = aUser();
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        Role savedRole = new Role();
        savedRole.setId(2);
        savedRole.setAuthority("ROLE_BANK_AGENT");
        when(roleService.save(any(Role.class))).thenReturn(savedRole);
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.assignRole(USER_ID, "BANK_AGENT");

        assertThat(result.getAuthorities()).containsExactly(savedRole);
    }

    @Test
    void assignRole_setsClientRole() {
        User user = aUser();
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        Role savedRole = new Role();
        savedRole.setId(3);
        savedRole.setAuthority("ROLE_CLIENT");
        when(roleService.save(any(Role.class))).thenReturn(savedRole);
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.assignRole(USER_ID, "CLIENT");

        assertThat(result.getAuthorities()).containsExactly(savedRole);
    }

    // ROLE_ADMIN is never reachable through this feature — promoting a user
    // to Admin must stay outside self-service admin user management.
    @Test
    void assignRole_rejectsAdminRole() {
        assertThatThrownBy(() -> userService.assignRole(USER_ID, "ADMIN"))
                .isInstanceOf(InvalidRoleException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void assignRole_rejectsUnknownRole() {
        assertThatThrownBy(() -> userService.assignRole(USER_ID, "SUPERADMIN"))
                .isInstanceOf(InvalidRoleException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void assignRole_rejected_whenUserDoesNotExist() {
        when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.assignRole(USER_ID, "CLIENT"))
                .isInstanceOf(UserNotFoundException.class);
    }
}
