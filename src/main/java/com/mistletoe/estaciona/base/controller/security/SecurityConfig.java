package com.mistletoe.estaciona.base.controller.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .headers().frameOptions().disable()

            .and()
            .authorizeHttpRequests(auth -> auth
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

                .requestMatchers("/AdminViews/**").hasRole("ADMINISTRADOR")
                .requestMatchers("/cliente/**").hasAnyRole("CLIENTE")
                .anyRequest().authenticated()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/login")
                .permitAll()
            );

        return http.build();
    }

    // *** Este bean arregla el error de AuthenticationManager ***
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class).build();
    }
}
