package com.mohcine.banqueApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/**
 * @author USER
 **/
@Configuration
public class RestClientConfig {

    @Bean
    public RestClient riskRestClient() {
        return RestClient.builder()
                .baseUrl("http://localhost:5000")
                .build();
    }
}
