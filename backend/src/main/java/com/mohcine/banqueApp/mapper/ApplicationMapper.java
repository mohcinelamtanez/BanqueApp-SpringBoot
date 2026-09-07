package com.mohcine.banqueApp.mapper;

import com.mohcine.banqueApp.dto.ApplicationCreateDto;
import com.mohcine.banqueApp.dto.ApplicationResponseDTO;
import com.mohcine.banqueApp.entity.Application;
import com.mohcine.banqueApp.enums.ApplicationStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * @author USER
 **/
@Component
public class ApplicationMapper {

    public Application toEntity(ApplicationCreateDto dto) {
        Application application = new Application();
        application.setLoanType(dto.getLoanType());
        application.setRequestedAmount(dto.getRequestedAmount());
        application.setRequestedDuration(dto.getRequestedDuration());
        application.setApplicationDate(LocalDate.now());
        application.setStatus(ApplicationStatus.PENDING);
        return application;
    }

    public ApplicationResponseDTO toDTO(Application application) {
        return new ApplicationResponseDTO(
                application.getId(),
                application.getClient() != null ? application.getClient().getClientReference() : null,
                application.getLoanType(),
                application.getRequestedAmount(),
                application.getRequestedDuration(),
                application.getApplicationDate(),
                application.getStatus(),
                application.getRejectionReason()
        );
    }
}
