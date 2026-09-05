package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.dto.ApplicationCreateDto;
import com.mohcine.banqueApp.dto.ApplicationDecisionDto;
import com.mohcine.banqueApp.entity.Application;

import java.util.List;

/**
 * @author USER
 **/
public interface ApplicationService {

    Application submitApplication(String clientReference, ApplicationCreateDto dto);

    List<Application> getApplicationsByClientReference(String clientReference);

    List<Application> getAllApplications();

    Application decide(Integer applicationId, ApplicationDecisionDto dto);
}
