package com.mohcine.banqueApp.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


/**
 * @author USER
 **/

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI banqueAppOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BanqueApp API")
                        .version("1.0")
                        .description("API de gestion des clients et des prêts"));
    }
}



