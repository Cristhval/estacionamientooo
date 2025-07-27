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
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        try {
            HashMap<String, Object> usuario = daoUsuario.busquedaCorreo(correo);
            System.out.println("si nos esta entregando un usuario por el correoooo: " + usuario);
            if (usuario == null) {
                throw new UsernameNotFoundException("Usuario no encontrado");
            }

            String password = (String) usuario.get("clave");
            String rol = "ROLE_" + usuario.get("rol");

            return User.builder()
                    .username(correo)
                    .password("{noop}" + password) 
                    .roles(rol.replace("ROLE_", "")) 
                    .build();
        } catch (Exception e) {
            throw new UsernameNotFoundException("Error buscando el usuario por el correo :c : " + e.getMessage());
        }
    }
}
