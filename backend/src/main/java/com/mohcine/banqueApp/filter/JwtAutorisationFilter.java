package com.mohcine.banqueApp.filter;

import com.mohcine.banqueApp.service.interfaces.UserService;
import com.mohcine.banqueApp.service.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * @author USER
 **/

    @Component
    public class JwtAutorisationFilter extends OncePerRequestFilter {
        @Autowired
        private UserService userService;

        @Autowired
        private JwtUtil jwtUtil;

        @Override
        protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
            String autorization = httpServletRequest.getHeader(JwtConstant.AUTORIZATION);
            String token = null;
            String usernameFromToken = null;
            if (autorization != null && autorization.startsWith(JwtConstant.BEARER)) {
                token = autorization.substring(JwtConstant.BEARER.length());
                try {
                    usernameFromToken = jwtUtil.getUsernameFromToken(token);
                } catch (Exception e) {
                    // Malformed/expired/tampered token — treat the request
                    // as unauthenticated instead of failing the whole
                    // filter chain, so a stale token on a public endpoint
                    // doesn't turn a 200 into a 403.
                    usernameFromToken = null;
                }
            }
            if (usernameFromToken != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    UserDetails userDetails = userService.loadUserByUsername(usernameFromToken);
                    if (jwtUtil.validateToken(token, userDetails)) {
                        jwtUtil.registerAuthenticationTokenInContext(userDetails, httpServletRequest);
                    }
                } catch (Exception e) {
                    // User deleted/disabled since the token was issued, or
                    // token expired — same graceful fallback as above.
                }
            }
            filterChain.doFilter(httpServletRequest,httpServletResponse);
        }

    }

