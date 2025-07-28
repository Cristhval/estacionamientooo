package com.mistletoe.estaciona.base.controller.security;

import com.vaadin.hilla.Endpoint;

import jakarta.annotation.security.PermitAll;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Endpoint
@PermitAll
public class SessionEndpoint {

    public UserSessionInfo getSessionInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            return new UserSessionInfo(auth.getName(), auth.getAuthorities().toString());
        }
        return null; // no autenticado
    }

    public record UserSessionInfo(String username, String roles) {}
}
