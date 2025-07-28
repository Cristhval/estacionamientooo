package com.mistletoe.estaciona.base.controller.security;

import com.vaadin.flow.spring.security.VaadinWebSecurity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends VaadinWebSecurity {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        // Rutas públicas
        http.authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/VAADIN/**",
                "/frontend/**",
                "/images/**",
                "/icons/**",
                "/manifest.webmanifest",
                "/sw.js",
                "/offline.html",
                "/favicon.ico",
                "/login",
                "/",
                "/connect/PersonaService/**",
                "/connect/ParqueaderoService/**",
                "/connect/PlazaService/**",
                "/connect/ReservaService/**",
                "/connect/TicketService/**",
                "/connect/VehiculoService/**",
                "/connect/CuentaService/**",
                "/cliente/registro",
                "HomeView"
            ).permitAll()

            // Rutas protegidas por roles
            .requestMatchers("/AdminViews/**").hasRole("ADMINISTRADOR")
            .requestMatchers("/cliente/**").hasRole("CLIENTE")
        );

        // Manejo de sesiones
        http.sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                   .maximumSessions(1)
                   .maxSessionsPreventsLogin(false)
        );

        // Deshabilitar CSRF para endpoints Hilla
        http.csrf(csrf -> csrf.ignoringRequestMatchers("/connect/**"));

        // Configuración Vaadin/Hilla
        super.configure(http);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
