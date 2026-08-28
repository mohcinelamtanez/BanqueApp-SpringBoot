package com.mohcine.banqueApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author USER
 **/
@Configuration
public class CorsConfig {

   // @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH")
//                        .allowedHeaders("*");
//                    //    .allowedOrigins("http://localhost:5176");
//            }
//        };
//    }
}
