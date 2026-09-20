package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.ApplicationCreateDto;
import com.mohcine.banqueApp.dto.ApplicationDecisionDto;
import com.mohcine.banqueApp.dto.ApplicationResponseDTO;
import com.mohcine.banqueApp.entity.Application;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.exception.ClientNotFoundException;
import com.mohcine.banqueApp.mapper.ApplicationMapper;
import com.mohcine.banqueApp.service.interfaces.ApplicationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author USER
 **/
@Tag(name = "this endpoint allows a client to submit and track loan applications")
@RestController
@RequestMapping("api/v1/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final ApplicationMapper applicationMapper;

    public ApplicationController(ApplicationService applicationService, ApplicationMapper applicationMapper) {
        this.applicationService = applicationService;
        this.applicationMapper = applicationMapper;
    }

    // The submitting client is always the authenticated user's own linked
    // Client — never taken from the request body — so a client can never
    // submit an application on someone else's behalf.
    @PostMapping
    public ApplicationResponseDTO submitApplication(
            @RequestBody ApplicationCreateDto dto,
            Authentication authentication) {
        Integer clientId = currentClientId(authentication);
        Application application = applicationService.submitApplication(clientId, dto);
        return applicationMapper.toDTO(application);
    }

    // Same principle: "my applications" is always derived from the
    // authenticated identity, never from a client-supplied id.
    @GetMapping("/me")
    public List<ApplicationResponseDTO> getMyApplications(Authentication authentication) {
        // No linked Client yet means no applications — an empty list, not
        // an error (submitting one still requires a Client, see above).
        if (((User) authentication.getPrincipal()).getClient() == null) {
            return List.of();
        }
        Integer clientId = currentClientId(authentication);
        return applicationService.getApplicationsByClientId(clientId).stream()
                .map(applicationMapper::toDTO)
                .toList();
    }

    // Admin/Bank Agent only (enforced in SpringSecurityConfig) — the
    // Application Management review queue. No single-application GET
    // exists, same pattern as Loan: the frontend fetches this list and
    // picks one by id client-side.
    @GetMapping
    public List<ApplicationResponseDTO> getAllApplications() {
        return applicationService.getAllApplications().stream()
                .map(applicationMapper::toDTO)
                .toList();
    }

    // Admin/Bank Agent only (enforced in SpringSecurityConfig) — approving
    // or rejecting turns the Application into a real Loan via the existing
    // Loan feature.
    @PutMapping("/{id}/decision")
    public ApplicationResponseDTO decide(@PathVariable Integer id, @RequestBody ApplicationDecisionDto dto) {
        return applicationMapper.toDTO(applicationService.decide(id, dto));
    }

    private Integer currentClientId(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        if (user.getClient() == null) {
            throw new ClientNotFoundException("(current user is not linked to a client)");
        }
        return user.getClient().getId();
    }
}
