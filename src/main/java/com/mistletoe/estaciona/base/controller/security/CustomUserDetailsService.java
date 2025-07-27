package com.mistletoe.estaciona.base.controller.security;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoUsuario;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final DaoUsuario daoUsuario = new DaoUsuario();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //HashMap<String, Object> mapa = daoUsuario.findByUsername(username);
        HashMap<String, Object> mapa = new HashMap<>();

        if (mapa == null) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

        String password = (String) mapa.get("clave");
        String role = "ROLE_" + mapa.get("rol"); // Spring requiere ROLE_ prefix

        return User.builder()
                .username("roble@gmail.com")
                .password("{noop}" + "ramiro123") // {noop} = sin cifrar
                .roles("ADMINISTRADOR") // Ej: ADMINISTRADOR o CLIENTE
                .build();
    }
}
