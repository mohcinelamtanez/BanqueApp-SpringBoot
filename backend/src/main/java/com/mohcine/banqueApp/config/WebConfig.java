package com.mohcine.banqueApp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Serves uploaded files (Client profile photos) back out from
 * {@code app.upload.dir} — the same directory {@link
 * com.mohcine.banqueApp.service.impl.LocalFileStorageService} writes to.
 * Mapped under "/api/uploads/**" (not a bare "/uploads/**") so it goes
 * through the exact same proxy/prefix as every other endpoint, and through
 * Spring Security like a normal request — see the "/api/uploads/**"
 * matcher in {@link SpringSecurityConfig} that requires authentication.
 *
 * @author USER
 **/
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String uploadDir;

    public WebConfig(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadDir = uploadDir;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = "file:" + Paths.get(uploadDir).toAbsolutePath().normalize() + "/";
        registry.addResourceHandler("/api/uploads/**")
                .addResourceLocations(location);
    }
}
