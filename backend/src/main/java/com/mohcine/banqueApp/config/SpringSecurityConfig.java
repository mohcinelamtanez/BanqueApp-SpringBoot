package com.mohcine.banqueApp.config;

import com.mohcine.banqueApp.filter.JwtAuthenticationFilter;
import com.mohcine.banqueApp.filter.JwtAutorisationFilter;
import com.mohcine.banqueApp.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {

    private final UserService userService;
    private final JwtAutorisationFilter jwtAutorisationFilter;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public SpringSecurityConfig(
            UserService userService,
            JwtAutorisationFilter jwtAutorisationFilter ,
            PasswordEncoder passwordEncoder
    ) {
        this.userService = userService;
        this.jwtAutorisationFilter = jwtAutorisationFilter;
        this.passwordEncoder = passwordEncoder;
    }



    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userService);

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationManager authenticationManager) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Routes publiques
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v1/api/authentification/**",
                                "/login/**",
                                "/v1/api/pub/**",
                                "/api/v1/clients/**",
                                "/v1/api/admin/user/sign-in/**",
                                "/api/v1/clients",
                                "/api/v1/clients/reference/{reference}"
                        ).permitAll()

                        // ADMIN
                        .requestMatchers("/v1/api/admin/**")
                        .hasAuthority("ROLE_ADMIN")

                        // CHEF
                        .requestMatchers("/v1/api/chef/**")
                        .hasAuthority("ROLE_CHEF")

                        // Tout le reste nécessite une authentification
                        .anyRequest()
                        .authenticated()
                )

                .authenticationProvider(authenticationProvider())

                .addFilterBefore(
                        jwtAutorisationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}



