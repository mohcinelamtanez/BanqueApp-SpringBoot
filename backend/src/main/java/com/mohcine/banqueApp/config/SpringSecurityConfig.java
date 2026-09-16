package com.mohcine.banqueApp.config;

import com.mohcine.banqueApp.filter.JwtAuthenticationFilter;
import com.mohcine.banqueApp.filter.JwtAutorisationFilter;
import com.mohcine.banqueApp.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

    private final PasswordEncoder passwordEncoder;

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
                                "/api/v1/auth/**",
                                "/v1/api/pub/**"
                        ).permitAll()

                        // "My ..." endpoints derive the client strictly from
                        // the authenticated identity (never a client-supplied
                        // id/reference) — they must never be reachable
                        // anonymously, since the controller casts the
                        // principal to User to find the linked Client.
                        .requestMatchers(
                                "/api/v1/loans/me",
                                "/api/v1/payments/me",
                                "/api/v1/applications/me",
                                "/api/v1/clients/me",
                                "/api/v1/clients/me/profile-photo"
                        ).authenticated()

                        // Uploaded Client profile photos — never publicly
                        // exposed. Any authenticated user (Client, Admin or
                        // Bank Agent) may view one, since Admin Client
                        // Management must be able to display any client's
                        // photo; this is still strictly narrower than the
                        // fully public /api/v1/clients/** below.
                        .requestMatchers("/api/uploads/**").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/v1/applications")
                        .hasAuthority("ROLE_CLIENT")

                        // The full Application review queue (Application
                        // Management) — Admin/Bank Agent only, a Client only
                        // ever sees its own via /me above.
                        .requestMatchers(HttpMethod.GET, "/api/v1/applications")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_BANK_AGENT")

                        // Deciding an Application, and marking a payment as
                        // paid/unpaid, are Admin/Bank Agent actions only — a
                        // Client is strictly read-only for both. Enforced
                        // here (backend authorization layer), not only by
                        // hiding the button in the frontend.
                        .requestMatchers(HttpMethod.PUT, "/api/v1/applications/*/decision")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_BANK_AGENT")

                        .requestMatchers(HttpMethod.PUT,
                                "/api/v1/payments/*/mark-paid",
                                "/api/v1/payments/*/mark-unpaid"
                        ).hasAnyAuthority("ROLE_ADMIN", "ROLE_BANK_AGENT")

                        // Every other Client endpoint (full list, lookup by
                        // reference, create, update, delete) is Admin/Bank
                        // Agent only — a Client must only ever see/edit their
                        // own profile, via /api/v1/clients/me above (matched
                        // first). This used to be permitAll(), letting
                        // anyone — unauthenticated — read, modify or delete
                        // any client's data.
                        .requestMatchers(
                                "/api/v1/clients/**",
                                "/api/v1/clients"
                        ).hasAnyAuthority("ROLE_ADMIN", "ROLE_BANK_AGENT")

                        // Same reasoning as Payments below: no ownership
                        // check exists on this endpoint, so it must not be
                        // reachable by an unauthenticated caller. Kept
                        // Admin/Bank Agent only, same as the underwriting
                        // flow that consumes it.
                        .requestMatchers("/api/v1/risk-assesments/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_BANK_AGENT")

                        // Every other /api/v1/payments/** endpoint (lookup
                        // by loanId, mark-paid/unpaid already handled above)
                        // is Admin/Bank Agent only — a Client must only ever
                        // see their own payments, via /api/v1/payments/me
                        // above. This used to be permitAll(), letting anyone
                        // dump any loan's full payment schedule by
                        // enumerating loanId, with zero authentication.
                        .requestMatchers("/api/v1/payments/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_BANK_AGENT")

                        // Every other /api/v1/loans/** endpoint (the full
                        // list, lookup by clientId/reference, create,
                        // update, delete) is Admin/Bank Agent only — a
                        // Client must only ever see their own loans, via
                        // /api/v1/loans/me above (matched first, so it stays
                        // reachable by an authenticated Client). This used
                        // to be permitAll(), letting anyone — including a
                        // Client, or an unauthenticated caller — read (or
                        // even write) every client's loan data.
                        .requestMatchers("/api/v1/loans/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_BANK_AGENT")

                        // Admin-only user management (list accounts, assign
                        // a Bank Agent/Client role) — never reachable by a
                        // Bank Agent or Client.
                        .requestMatchers("/api/v1/users/**")
                        .hasAuthority("ROLE_ADMIN")

                        // ADMIN
                        .requestMatchers("/v1/api/admin/**")
                        .hasAuthority("ROLE_ADMIN")


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



