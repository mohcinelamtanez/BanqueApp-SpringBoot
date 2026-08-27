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
                usernameFromToken = jwtUtil.getUsernameFromToken(token);
            }
            if (usernameFromToken != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userService.loadUserByUsername(usernameFromToken);
                if (jwtUtil.validateToken(token, userDetails)) {
                    jwtUtil.registerAuthenticationTokenInContext(userDetails, httpServletRequest);
                }
            }
            filterChain.doFilter(httpServletRequest,httpServletResponse);
        }

    }

